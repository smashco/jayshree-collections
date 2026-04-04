import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET ?? 'jayshree-collections-images';

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const productSlug = (formData.get('productSlug') as string) || 'product';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, or WebP.' }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `products/${productSlug}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

  const webpBuffer = await sharp(buffer)
    .resize(1200, 1500, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 100 })
    .toBuffer();

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: filename,
    Body: webpBuffer,
    ContentType: 'image/webp',
    ACL: 'public-read',
  }));

  const url = `https://${BUCKET}.s3.ap-south-1.amazonaws.com/${filename}`;
  return NextResponse.json({ url, filename });
}
