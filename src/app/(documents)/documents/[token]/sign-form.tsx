"use client";

import { CheckCircle2, Eraser, Loader2, PenLine } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { signQuote, type SignState } from "./actions";

const initial: SignState = {};

/** Cadre de signature au doigt, au stylet ou à la souris. */
function SignaturePad({ onChange }: { onChange: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Résolution réelle de l'écran : un trait net, même sur mobile.
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(ratio, ratio);
    context.lineWidth = 2.2;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#0D0D12";
  }, []);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setEmpty(true);
    onChange("");
  };

  return (
    <div>
      <div className="relative rounded-[4px] border border-[#D9D9D9] bg-white">
        <canvas
          ref={canvasRef}
          aria-label="Zone de signature"
          className="block h-40 w-full touch-none"
          onPointerDown={(event) => {
            drawing.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            const context = event.currentTarget.getContext("2d");
            const { x, y } = point(event);
            context?.beginPath();
            context?.moveTo(x, y);
          }}
          onPointerMove={(event) => {
            if (!drawing.current) return;
            const context = event.currentTarget.getContext("2d");
            const { x, y } = point(event);
            context?.lineTo(x, y);
            context?.stroke();
            setEmpty(false);
          }}
          onPointerUp={(event) => {
            if (!drawing.current) return;
            drawing.current = false;
            onChange(event.currentTarget.toDataURL("image/png"));
          }}
        />
        {empty ? (
          <span className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-[#555]">
            <span className="flex items-center gap-2">
              <PenLine className="size-4" />
              Signez ici
            </span>
          </span>
        ) : null}
      </div>
      <button type="button" onClick={clear} className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#555] hover:text-[#0D0D12]">
        <Eraser className="size-3.5" />
        Effacer
      </button>
    </div>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 bg-[#1D2B3A] px-5 py-3.5 text-[0.9375rem] font-semibold text-white hover:bg-[#0D0D12] disabled:opacity-70"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {pending ? "Signature en cours…" : "Signer le devis"}
    </button>
  );
}

export function SignForm({ token, number, total, defaultName, defaultEmail }: { token: string; number: string; total: string; defaultName: string; defaultEmail: string }) {
  const [state, action] = useActionState(signQuote, initial);
  const [signature, setSignature] = useState("");

  if (state.signed) {
    return (
      <div className="border border-[#D9D9D9] bg-white p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 size-10 text-green-600" />
        <p className="text-lg font-bold">Merci, le devis est signé.</p>
        <p className="mt-1 text-sm text-[#555]">Une copie signée vient de partir par e-mail.</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 border border-[#D9D9D9] bg-white p-6">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="signature" value={signature} />
      <div>
        <p className="text-[1rem] font-bold">Signer le devis {number}</p>
        <p className="text-sm text-[#555]">Montant : {total}</p>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block text-[#555]">Nom et prénom</span>
        <input name="name" required defaultValue={defaultName} autoComplete="name" className="w-full border border-[#D9D9D9] px-3 py-2.5 outline-none focus:border-[#1D2B3A]" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-[#555]">E-mail (pour recevoir la copie signée)</span>
        <input name="email" type="email" required defaultValue={defaultEmail} autoComplete="email" className="w-full border border-[#D9D9D9] px-3 py-2.5 outline-none focus:border-[#1D2B3A]" />
      </label>
      <div className="text-sm">
        <span className="mb-1 block text-[#555]">Signature</span>
        <SignaturePad onChange={setSignature} />
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input name="consent" type="checkbox" required className="mt-0.5 size-4 accent-[#1D2B3A]" />
        <span>
          <strong>Bon pour accord.</strong> J&apos;accepte le devis {number} et ses conditions, et je reconnais que cette signature électronique
          m&apos;engage comme une signature manuscrite.
        </span>
      </label>
      {state.error ? <p role="alert" className="bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p> : null}
      <Submit />
      <p className="text-xs leading-relaxed text-[#555]">
        La date, l&apos;heure, votre adresse IP et une empreinte du document sont enregistrées avec votre signature, comme preuve de l&apos;accord.
      </p>
    </form>
  );
}
