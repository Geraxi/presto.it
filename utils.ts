/**
 * Prepends the base URL to a given asset path.
 * This ensures that assets are loaded correctly, regardless of
 * where the application is deployed.
 * For the Google AI Studio environment, it uses absolute URLs
 * from a public GitHub repository.
 * @param path The path to the asset from the project root (e.g., 'public/images/foo.png').
 * @returns The full, resolved path to the asset.
 */
export const asset = (path: string): string => {
  const githubRawBaseUrl = 'https://raw.githubusercontent.com/Geraxi/presto.it/main/';
  // The path provided is relative to the project root, e.g., 'public/images/logo.png'.
  // We just need to prepend the GitHub base URL to the existing path.
  return `${githubRawBaseUrl}${path}`;
};