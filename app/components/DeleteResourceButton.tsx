"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";

type ConfirmStep = 1 | 2;

interface DeleteResourceButtonProps {
  resourceId: string;
  resourceTitle: string;
}

export default function DeleteResourceButton({
  resourceId,
  resourceTitle,
}: DeleteResourceButtonProps) {
  const router = useRouter();
  const { customFetch } = useFetch();
  const titleId = useId();
  const descId = useId();
  const confirmInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ConfirmStep>(1);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleMatches =
    confirmText.trim().toLowerCase() === resourceTitle.trim().toLowerCase();

  const reset = () => {
    setOpen(false);
    setStep(1);
    setConfirmText("");
    setError(null);
    setIsDeleting(false);
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        reset();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, isDeleting]);

  useEffect(() => {
    if (open && step === 2) {
      confirmInputRef.current?.focus();
    }
  }, [open, step]);

  const handleDelete = async () => {
    if (!titleMatches || isDeleting) return;

    try {
      setIsDeleting(true);
      setError(null);
      await customFetch(`/api/resources/${resourceId}`, "DELETE");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete resource. Please try again."
      );
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-danger inline-flex items-center gap-2"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete resource
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-canvas/70 backdrop-blur-[2px]"
            aria-label="Close dialog"
            disabled={isDeleting}
            onClick={() => {
              if (!isDeleting) reset();
            }}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="relative w-full max-w-md rounded-lg border border-hairline bg-surface p-6 shadow-xl"
          >
            {step === 1 ? (
              <>
                <h2
                  id={titleId}
                  className="font-display text-2xl tracking-[-0.02em] text-ink mb-2"
                >
                  Delete this resource?
                </h2>
                <p id={descId} className="text-sm text-muted leading-relaxed mb-6">
                  You’re about to remove{" "}
                  <span className="text-ink font-medium">{resourceTitle}</span>.
                  This cannot be undone.
                </p>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-danger"
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2
                  id={titleId}
                  className="font-display text-2xl tracking-[-0.02em] text-ink mb-2"
                >
                  Confirm deletion
                </h2>
                <p id={descId} className="text-sm text-muted leading-relaxed mb-4">
                  Type{" "}
                  <span className="text-ink font-medium">{resourceTitle}</span>{" "}
                  to permanently delete this resource.
                </p>

                <label className="block mb-4">
                  <span className="sr-only">Resource title</span>
                  <input
                    ref={confirmInputRef}
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    disabled={isDeleting}
                    className="input-field w-full"
                    placeholder="Resource title"
                    autoComplete="off"
                    aria-invalid={confirmText.length > 0 && !titleMatches}
                  />
                </label>

                {error && <div className="mb-4 error-banner">{error}</div>}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    disabled={isDeleting}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={!titleMatches || isDeleting}
                    className="btn-danger inline-flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      "Delete permanently"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
