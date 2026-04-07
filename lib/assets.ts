const S3_BASE = 'https://jayshree-collections-images.s3.ap-south-1.amazonaws.com';

export function assetUrl(path: string): string {
    // Serve videos from S3 CDN
    if (path.startsWith('/videos/')) {
        return `${S3_BASE}${path}`;
    }
    return path;
}
