/** Default image used when no custom upload — show flag gradient instead. */
export const DESTINATION_PLACEHOLDER_IMAGES = new Set(["", "/classroom_bg.png"]);

export function isDestinationPhotoUrl(url: string | undefined): boolean {
  const trimmed = url?.trim() || "";
  return Boolean(trimmed) && !DESTINATION_PLACEHOLDER_IMAGES.has(trimmed);
}
