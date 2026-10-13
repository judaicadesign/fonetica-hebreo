-- Judaica Design® — consultas de solo lectura para Claude
-- Proyecto privado Supabase: athiruoimehofqzrplnl.
-- Se requiere conexión autorizada. NO usar service_role de forma pública.
-- Los originales PNG/PDF aún no están cargados en Storage.

-- 1. Documento maestro registrado en Supabase.
SELECT value FROM public.app_state
WHERE key = 'jd_artscroll_evidence_manifest_v1';

-- 2. Referencias de imágenes/PDF ArtScroll, no archivos físicos.
SELECT original_filename, media_type, associated_psalms,
       source_sha256_claims, hash_verified, library_path,
       github_original_url, storage_bucket, storage_path,
       storage_status, reference_claims
FROM public.jd_editorial_evidence
ORDER BY original_filename;

-- 3. Evidencias que todavía necesitan transferencia de los originales.
SELECT original_filename, media_type, library_path
FROM public.jd_editorial_evidence
WHERE storage_path IS NULL
ORDER BY original_filename;

-- 4. Revisión del rafé U+05BF para shevá na U+05B0, sin modificar el máster.
SELECT psalm, verse, original_word, proposed_word,
       sheva_cluster_indices, evidence_filename,
       evidence_sha256_claim, source_review_file,
       source_evidence_note, state, applied_to_master
FROM public.jd_rafe_review
ORDER BY psalm, verse, original_word;

-- 5. Borrador parcial del salmo 1, jamás FINAL.
SELECT value FROM public.app_state
WHERE key = 'jd_rafe_draft_psalm_001_v1';

-- 6. Comprobar existencia real de objetos, NO depender del inventario.
SELECT name, bucket_id, created_at
FROM storage.objects
WHERE bucket_id = 'jd-artscroll-evidence'
ORDER BY name;
