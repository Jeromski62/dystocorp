// Shared between the upload UI (client-side validation) and the server
// action (authoritative validation) so the two never drift apart.
export const DOSSIER_PORTRAIT_BUCKET = "dossier-portraits";
export const MAX_PORTRAIT_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_PORTRAIT_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export type DossierKind = "captain" | "first_mate" | "soldier";

// Object path convention "{crew_id}/{kind}-{dossier_id}-{version}.{ext}" --
// the crew_id folder segment lets the storage RLS policies
// (0040_dossier_portraits.sql) recover it via storage.foldername() and reuse
// owns_crew()/can_read_crew(). The version suffix (upload timestamp) makes
// every re-upload a brand-new URL instead of overwriting the previous one in
// place -- without it, the old portrait's bytes stayed stuck in the browser/
// CDN cache at that same URL even after a fresh upload replaced the object.
export function dossierPortraitPath(crewId: string, kind: DossierKind, dossierId: string, extension: string): string {
  return `${crewId}/${kind}-${dossierId}-${Date.now()}.${extension}`;
}

// portrait_path is stored, not the full URL, so a bucket/domain change never
// needs a data migration -- the public URL is derived on read instead.
export function getDossierPortraitUrl(path: string | null): string | null {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${DOSSIER_PORTRAIT_BUCKET}/${path}`;
}
