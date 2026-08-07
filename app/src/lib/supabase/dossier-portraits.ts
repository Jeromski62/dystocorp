// Shared between the upload UI (client-side validation) and the server
// action (authoritative validation) so the two never drift apart.
export const DOSSIER_PORTRAIT_BUCKET = "dossier-portraits";
export const MAX_PORTRAIT_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_PORTRAIT_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export type DossierKind = "captain" | "first_mate" | "soldier";

// Object path convention "{crew_id}/{kind}-{dossier_id}.{ext}" -- lets the
// storage RLS policies (0040_dossier_portraits.sql) recover crew_id from the
// path via storage.foldername() and reuse owns_crew()/can_read_crew().
export function dossierPortraitPath(crewId: string, kind: DossierKind, dossierId: string, extension: string): string {
  return `${crewId}/${kind}-${dossierId}.${extension}`;
}

// portrait_path is stored, not the full URL, so a bucket/domain change never
// needs a data migration -- the public URL is derived on read instead.
export function getDossierPortraitUrl(path: string | null): string | null {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${DOSSIER_PORTRAIT_BUCKET}/${path}`;
}
