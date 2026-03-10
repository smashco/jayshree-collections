// Prepends the basePath for GitHub Pages deployments where basePath is set.
// next/image handles this automatically, but raw <video>/<img> src attrs do not.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function assetUrl(path: string): string {
    return `${BASE_PATH}${path}`;
}
