import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const REGION = process.env.AWS_REGION ?? 'ap-south-1';

const s3 = new S3Client({
  region: REGION,
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

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const isVideo = file.type.startsWith('video/');
  const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);

  if (!isImage && !isVideo) {
    return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WebP, or MP4/MOV.' }, { status: 400 });
  }

  const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: `File too large. Max ${isVideo ? '100MB' : '10MB'}.` }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  let key: string;
  let body: Buffer;
  let contentType: string;

  if (isVideo) {
    const ext = file.name.split('.').pop() ?? 'mp4';
    key = `products/videos/${productSlug}-${uid}.${ext}`;
    body = buffer;
    contentType = file.type;
  } else {
    key = `products/${productSlug}-${uid}.webp`;
    body = await sharp(buffer)
      .resize(1200, 1500, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 100 })
      .toBuffer();
    contentType = 'image/webp';
  }

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    ACL: 'public-read',
  }));

  const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
  return NextResponse.json({ url, mediaType: isVideo ? 'video' : 'image' });
}
