// Prepends the basePath for GitHub Pages deployments.
// next/image handles this automatically, but raw <video>/<img> src attrs do not.
// Keep this in sync with basePath in next.config.ts
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/jayshree-collections';

export function assetUrl(path: string): string {
    return `${BASE_PATH}${path}`;
}
