import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';
import * as XLSX from 'xlsx';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Read Products sheet
    const productSheet = workbook.Sheets['Products'];
    if (!productSheet) return NextResponse.json({ error: 'Sheet "Products" not found. Make sure your Excel has a sheet named "Products".' }, { status: 400 });

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(productSheet);
    if (rows.length === 0) return NextResponse.json({ error: 'No data rows found in Products sheet' }, { status: 400 });

    // Read Variants sheet (optional)
    const variantSheet = workbook.Sheets['Variants'];
    const variantRows = variantSheet ? XLSX.utils.sheet_to_json<Record<string, unknown>>(variantSheet) : [];

    // Cache categories
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));
    const categorySlugMap = new Map(categories.map(c => [c.slug.toLowerCase(), c.id]));

    const results: { row: number; product: string; status: string; error?: string }[] = [];
    let created = 0;
    let updated = 0;
    let errors = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // Excel row (1-indexed + header)

      try {
        const name = String(row['Product Name'] || '').trim();
        if (!name) { results.push({ row: rowNum, product: '(empty)', status: 'skipped', error: 'Product Name is required' }); errors++; continue; }

        const slug = String(row['Slug'] || '').trim() || slugify(name);
        const categoryName = String(row['Category'] || '').trim();
        const subCategoryName = String(row['Sub Category'] || '').trim();

        if (!categoryName) {
          results.push({ row: rowNum, product: name, status: 'error', error: 'Category is required' });
          errors++;
          continue;
        }

        // Auto-create category if it doesn't exist
        let categoryId = categoryMap.get(categoryName.toLowerCase()) || categorySlugMap.get(categoryName.toLowerCase());
        if (!categoryId) {
          const catSlug = slugify(categoryName);
          const newCat = await prisma.category.create({
            data: { name: categoryName, slug: catSlug, sortOrder: categories.length + categoryMap.size },
          });
          categoryId = newCat.id;
          categoryMap.set(categoryName.toLowerCase(), newCat.id);
          categorySlugMap.set(catSlug, newCat.id);
          console.log(`[bulk-upload] Auto-created category: ${categoryName}`);
        }

        // Auto-create sub-category if specified
        if (subCategoryName) {
          const subKey = `${categoryName}/${subCategoryName}`.toLowerCase();
          let subCatId = categoryMap.get(subKey);
          if (!subCatId) {
            const subSlug = slugify(subCategoryName);
            const existingSub = await prisma.category.findUnique({ where: { slug: subSlug } });
            if (existingSub) {
              subCatId = existingSub.id;
            } else {
              const newSub = await prisma.category.create({
                data: { name: subCategoryName, slug: subSlug, parentId: categoryId, sortOrder: 0 },
              });
              subCatId = newSub.id;
            }
            categoryMap.set(subKey, subCatId);
          }
          categoryId = subCatId; // Use sub-category as the product's category
        }

        const priceStr = String(row['Price (₹)'] || row['Price'] || '0');
        const price = Math.round(parseFloat(priceStr.replace(/[₹,]/g, '')) * 100); // Convert rupees to paisa
        const compareAtStr = String(row['Compare At Price (₹)'] || row['Compare At Price'] || '');
        const compareAt = compareAtStr ? Math.round(parseFloat(compareAtStr.replace(/[₹,]/g, '')) * 100) : undefined;

        const description = String(row['Description'] || '').trim() || undefined;
        const material = String(row['Material'] || '').trim() || undefined;
        const isFeatured = String(row['Featured'] || '').toLowerCase() === 'yes';
        const isActive = String(row['Active'] || 'yes').toLowerCase() !== 'no';
        const metaTitle = String(row['Meta Title'] || '').trim() || undefined;
        const metaDesc = String(row['Meta Description'] || '').trim() || undefined;
        const tagsStr = String(row['Tags'] || '').trim();
        const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
        const imageUrl = String(row['Image URL'] || '').trim() || undefined;

        // Variant from same row (simple mode)
        const variantSku = String(row['SKU'] || '').trim();
        const variantName = String(row['Variant Name'] || 'Default').trim();
        const variantSize = String(row['Size'] || '').trim() || undefined;
        const variantWeight = String(row['Weight'] || '').trim() || undefined;
        const variantPurity = String(row['Purity'] || '').trim() || undefined;
        const stockStr = String(row['Stock'] || '10');
        const stock = parseInt(stockStr) || 10;

        // Check if product exists
        const existing = await prisma.product.findUnique({ where: { slug } });

        if (existing) {
          // Update existing product
          await prisma.product.update({
            where: { slug },
            data: {
              name,
              description,
              material,
              basePrice: price,
              compareAt: compareAt ?? undefined,
              categoryId,
              isFeatured,
              isActive,
              metaTitle,
              metaDesc,
              tags,
            },
          });

          // Update/create variant if SKU provided
          if (variantSku) {
            const existingVariant = await prisma.productVariant.findUnique({ where: { sku: variantSku } });
            if (existingVariant) {
              await prisma.productVariant.update({
                where: { sku: variantSku },
                data: { name: variantName, size: variantSize, weight: variantWeight, purity: variantPurity, price, stock },
              });
            } else {
              await prisma.productVariant.create({
                data: { productId: existing.id, sku: variantSku, name: variantName, size: variantSize, weight: variantWeight, purity: variantPurity, price, stock },
              });
            }
          }

          results.push({ row: rowNum, product: name, status: 'updated' });
          updated++;
        } else {
          // Create new product
          const sku = variantSku || `JC-${slug.toUpperCase().slice(0, 8)}-${String(i).padStart(3, '0')}`;

          const product = await prisma.product.create({
            data: {
              name,
              slug,
              description,
              material,
              basePrice: price,
              compareAt: compareAt ?? undefined,
              categoryId,
              isFeatured,
              isActive,
              metaTitle,
              metaDesc,
              tags,
              variants: {
                create: { sku, name: variantName, size: variantSize, weight: variantWeight, purity: variantPurity, price, stock },
              },
              ...(imageUrl ? { images: { create: { url: imageUrl, alt: name, isPrimary: true } } } : {}),
            },
          });

          results.push({ row: rowNum, product: name, status: 'created' });
          created++;
        }
      } catch (err) {
        results.push({ row: rowNum, product: String(rows[i]['Product Name'] || ''), status: 'error', error: err instanceof Error ? err.message : 'Unknown error' });
        errors++;
      }
    }

    // Process Variants sheet (for multi-variant products)
    let variantsProcessed = 0;
    for (let i = 0; i < variantRows.length; i++) {
      const row = variantRows[i];
      try {
        const productSlug = String(row['Product Slug'] || '').trim();
        const sku = String(row['SKU'] || '').trim();
        if (!productSlug || !sku) continue;

        const product = await prisma.product.findUnique({ where: { slug: productSlug } });
        if (!product) continue;

        const priceStr = String(row['Price (₹)'] || row['Price'] || '0');
        const price = Math.round(parseFloat(priceStr.replace(/[₹,]/g, '')) * 100);

        const data = {
          name: String(row['Variant Name'] || 'Default').trim(),
          size: String(row['Size'] || '').trim() || null,
          weight: String(row['Weight'] || '').trim() || null,
          purity: String(row['Purity'] || '').trim() || null,
          price,
          stock: parseInt(String(row['Stock'] || '10')) || 10,
        };

        const existing = await prisma.productVariant.findUnique({ where: { sku } });
        if (existing) {
          await prisma.productVariant.update({ where: { sku }, data });
        } else {
          await prisma.productVariant.create({ data: { ...data, productId: product.id, sku } });
        }
        variantsProcessed++;
      } catch (err) {
        // skip bad variant rows
      }
    }

    return NextResponse.json({
      message: `Upload complete: ${created} created, ${updated} updated, ${errors} errors`,
      created,
      updated,
      errors,
      variantsProcessed,
      results,
    });

  } catch (err) {
    console.error('[bulk-upload] Error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Upload failed' }, { status: 500 });
  }
}

// GET: Download template
export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const categoryNames = categories.map(c => c.name).join(', ');

  const wb = XLSX.utils.book_new();

  // Products sheet
  const productsData = [
    {
      'Product Name': 'Royal Kundan Necklace',
      'Slug': 'royal-kundan-necklace',
      'Category': categories[0]?.name || 'Necklaces',
      'Sub Category': '',
      'Price (₹)': 24500,
      'Compare At Price (₹)': 28000,
      'Description': 'Handcrafted kundan necklace with meenakari work',
      'Material': '22k Gold · Uncut Diamonds',
      'Featured': 'Yes',
      'Active': 'Yes',
      'SKU': 'JC-RKN-001',
      'Variant Name': 'Default',
      'Size': '',
      'Weight': '45g',
      'Purity': '22k',
      'Stock': 10,
      'Image URL': '',
      'Meta Title': '',
      'Meta Description': '',
      'Tags': 'kundan, necklace, bridal',
    },
    {
      'Product Name': 'Temple Jhumkas',
      'Slug': 'temple-jhumkas',
      'Category': 'New Arrivals',
      'Sub Category': 'Temple Collection',
      'Price (₹)': 8500,
      'Compare At Price (₹)': '',
      'Description': 'Classic temple jhumkas with antique finish',
      'Material': '22k Gold · Antique Finish',
      'Featured': 'No',
      'Active': 'Yes',
      'SKU': 'JC-TJ-001',
      'Variant Name': 'Gold',
      'Size': '',
      'Weight': '15g',
      'Purity': '22k',
      'Stock': 20,
      'Image URL': '',
      'Meta Title': '',
      'Meta Description': '',
      'Tags': 'temple, jhumka, earrings',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(productsData);

  // Set column widths
  ws['!cols'] = [
    { wch: 30 }, { wch: 25 }, { wch: 18 }, { wch: 12 }, { wch: 20 },
    { wch: 50 }, { wch: 25 }, { wch: 10 }, { wch: 8 },
    { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 8 },
    { wch: 50 }, { wch: 30 }, { wch: 50 }, { wch: 30 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Products');

  // Variants sheet (for multi-variant products)
  const variantsData = [
    {
      'Product Slug': 'royal-kundan-necklace',
      'SKU': 'JC-RKN-002',
      'Variant Name': 'Rose Gold',
      'Price (₹)': 26000,
      'Size': '',
      'Weight': '48g',
      'Purity': '22k Rose',
      'Stock': 5,
    },
    {
      'Product Slug': 'temple-jhumkas',
      'SKU': 'JC-TJ-002',
      'Variant Name': 'Silver',
      'Price (₹)': 6500,
      'Size': '',
      'Weight': '12g',
      'Purity': 'Silver 925',
      'Stock': 15,
    },
  ];

  const vs = XLSX.utils.json_to_sheet(variantsData);
  vs['!cols'] = [
    { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
    { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 8 },
  ];
  XLSX.utils.book_append_sheet(wb, vs, 'Variants');

  // Instructions sheet
  const instructions = [
    { Instructions: '=== JAYSHREE COLLECTIONS — BULK PRODUCT UPLOAD ===' },
    { Instructions: '' },
    { Instructions: 'SHEET 1: Products (Required)' },
    { Instructions: '  • Product Name (required) — Full product name' },
    { Instructions: '  • Slug — URL-friendly name (auto-generated if empty)' },
    { Instructions: `  • Category (required) — Existing: ${categoryNames} · New ones are auto-created!` },
    { Instructions: '  • Sub Category — Optional sub-category under the main category (auto-created if new)' },
    { Instructions: '  • Price (₹) (required) — Price in Rupees (e.g. 24500)' },
    { Instructions: '  • Compare At Price (₹) — Original/MRP price for showing discount' },
    { Instructions: '  • Description — Product description' },
    { Instructions: '  • Material — e.g. "22k Gold · Uncut Diamonds"' },
    { Instructions: '  • Featured — "Yes" or "No" (shows on homepage)' },
    { Instructions: '  • Active — "Yes" or "No" (default: Yes)' },
    { Instructions: '  • SKU (required) — Unique stock code e.g. JC-RKN-001' },
    { Instructions: '  • Variant Name — e.g. "Gold", "Silver", "Default"' },
    { Instructions: '  • Size — e.g. "16 inches", "Free Size"' },
    { Instructions: '  • Weight — e.g. "45g"' },
    { Instructions: '  • Purity — e.g. "22k", "24k", "Silver 925"' },
    { Instructions: '  • Stock — Quantity available (default: 10)' },
    { Instructions: '  • Image URL — Direct link to product image (S3 or any URL)' },
    { Instructions: '  • Meta Title — SEO title' },
    { Instructions: '  • Meta Description — SEO description' },
    { Instructions: '  • Tags — Comma-separated tags' },
    { Instructions: '' },
    { Instructions: 'SHEET 2: Variants (Optional — for multiple variants per product)' },
    { Instructions: '  • Product Slug (required) — Must match a product from Sheet 1' },
    { Instructions: '  • SKU (required) — Unique code for this variant' },
    { Instructions: '  • Variant Name, Price, Size, Weight, Purity, Stock' },
    { Instructions: '' },
    { Instructions: 'NOTES:' },
    { Instructions: '  • Prices are in Rupees (₹), NOT paisa' },
    { Instructions: '  • If a product with same slug exists, it will be UPDATED' },
    { Instructions: '  • If a variant with same SKU exists, it will be UPDATED' },
    { Instructions: '  • Delete the sample rows before uploading your data' },
    { Instructions: '  • Upload images separately via admin portal after bulk upload' },
  ];

  const is = XLSX.utils.json_to_sheet(instructions);
  is['!cols'] = [{ wch: 80 }];
  XLSX.utils.book_append_sheet(wb, is, 'Instructions');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  return new Response(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="jayshree-bulk-upload-template.xlsx"',
    },
  });
}
