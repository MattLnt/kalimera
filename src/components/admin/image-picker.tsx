"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import NextImage from "next/image";
import { useRef, useState } from "react";

import { MAX_UPLOAD_BYTES, uploadToCloudinary, type UploadedMedia } from "./upload";

import { cn } from "@/lib/utils";

export type PickedMedia = UploadedMedia;

/** Sélecteur d'image unique (couverture d'un projet ou d'un article). */
export function ImagePicker({
  name,
  initial,
  label = "Image",
  hint,
}: {
  name: string;
  initial?: PickedMedia | null;
  label?: string;
  hint?: string;
}) {
  const [media, setMedia] = useState<PickedMedia | null>(initial ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Le fichier dépasse 10 Mo.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      setMedia(await uploadToCloudinary(file));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Envoi impossible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="field-label">{label}</span>
      <input type="hidden" name={name} value={media?.id ?? ""} />

      {media ? (
        <div className="relative w-full max-w-sm overflow-hidden rounded-field bg-aegean-50">
          <NextImage
            src={media.url}
            alt=""
            width={media.width}
            height={media.height}
            className="h-auto w-full"
          />
          <button
            type="button"
            onClick={() => setMedia(null)}
            aria-label="Retirer l'image"
            className="absolute top-2 right-2 grid size-8 cursor-pointer place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <UploadZone busy={busy} onClick={() => inputRef.current?.click()} />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void handleFile(file);
        }}
      />

      {hint && !error ? (
        <p className="mt-1.5 text-xs text-[var(--ink-45)]">{hint}</p>
      ) : null}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}

/** Galerie : plusieurs images, ordre conservé, identifiants sérialisés en JSON. */
export function GalleryPicker({
  name,
  initial = [],
  label = "Galerie",
  hint,
}: {
  name: string;
  initial?: PickedMedia[];
  label?: string;
  hint?: string;
}) {
  const [items, setItems] = useState<PickedMedia[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setBusy(true);
    setError("");
    const added: PickedMedia[] = [];

    for (const file of Array.from(files)) {
      if (file.size > MAX_UPLOAD_BYTES) {
        setError(`« ${file.name} » dépasse 10 Mo et a été ignoré.`);
        continue;
      }
      try {
        added.push(await uploadToCloudinary(file));
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Envoi impossible.");
      }
    }

    if (added.length > 0) setItems((current) => [...current, ...added]);
    setBusy(false);
  }

  return (
    <div>
      <span className="field-label">{label}</span>
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(items.map((item) => item.id))}
      />

      {items.length > 0 ? (
        <ul className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="relative overflow-hidden rounded-field bg-aegean-50"
            >
              <NextImage
                src={item.url}
                alt=""
                width={item.width}
                height={item.height}
                className="aspect-4/3 h-auto w-full object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setItems((current) => current.filter((media) => media.id !== item.id))
                }
                aria-label="Retirer cette image"
                className="absolute top-1.5 right-1.5 grid size-7 cursor-pointer place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <UploadZone
        busy={busy}
        compact={items.length > 0}
        onClick={() => inputRef.current?.click()}
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          const files = event.target.files;
          if (files && files.length > 0) void handleFiles(files);
          event.target.value = "";
        }}
      />

      {hint && !error ? (
        <p className="mt-1.5 text-xs text-[var(--ink-45)]">{hint}</p>
      ) : null}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}

function UploadZone({
  busy,
  compact = false,
  onClick,
}: {
  busy: boolean;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={cn(
        "flex w-full max-w-sm cursor-pointer flex-col items-center gap-2 rounded-field border-2 border-dashed border-black/10 text-center transition-colors",
        compact ? "px-4 py-4" : "px-6 py-9",
        busy ? "opacity-60" : "hover:border-aegean-400 hover:bg-aegean-50",
      )}
    >
      {busy ? (
        <Loader2 className="size-6 animate-spin text-aegean-600" />
      ) : (
        <ImagePlus className="size-6 text-aegean-600" />
      )}
      <span className="font-display text-sm font-semibold">
        {busy ? "Envoi en cours…" : "Choisir une image"}
      </span>
      {!compact ? (
        <span className="text-xs text-[var(--ink-45)]">
          JPG, PNG, WebP ou AVIF — 10 Mo maximum
        </span>
      ) : null}
    </button>
  );
}
