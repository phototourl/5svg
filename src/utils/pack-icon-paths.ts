export const PACK_ICON_DETAIL_LIMIT = 50;

export function getPackIconDetailHref(packId: string, iconId: string): string {
  return `/more/${packId}/icon/${encodeURIComponent(iconId)}`;
}
