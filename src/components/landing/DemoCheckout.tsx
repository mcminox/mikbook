"use client";

import Link from "next/link";
import { useState } from "react";
import type { PlanId } from "@/lib/stripe";
import { RevisionHeader } from "./RevisionHeader";

const PLANS: Record<PlanId, { label: string; price: string; period: string }> = {
  monthly: { label: "Monthly", price: "19,99 €", period: "per month" },
  yearly: { label: "Yearly", price: "149 €", period: "per year" },
};

export function DemoCheckout({ plan }: { plan: PlanId }) {
  const [complete, setComplete] = useState(false);
  const selectedPlan = PLANS[plan];

  return (
    <main className="min-h-dvh bg-[var(--landing-bg)] px-5 pb-12 pt-24 text-[var(--landing-fg)]">
      <RevisionHeader menuHref="/preview" />
      <section className="mx-auto w-full max-w-md rounded-xl border border-black/10 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800">
          Demo · no charge
        </p>
        <h1 className="mb-1 text-2xl font-semibold">Complete your subscription</h1>
        <p className="mb-6 text-sm text-black/55">
          Visual test flow. No payment details are requested or sent.
        </p>

        <div className="mb-5 flex items-center justify-between border-y border-black/10 py-4">
          <div>
            <p className="font-semibold">MIKBOOK · {selectedPlan.label}</p>
            <p className="text-xs text-black/50">{selectedPlan.period}</p>
          </div>
          <p className="font-semibold">{selectedPlan.price}</p>
        </div>

        <div
          aria-label="Demo payment card. No real card details entered."
          className="mb-5 rounded-lg bg-[#202821] p-4 text-white"
        >
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/60">
            Payment method · preview only
          </p>
          <p aria-hidden="true" className="mt-5 text-lg tracking-[0.16em]">
            •••• &nbsp;•••• &nbsp;•••• &nbsp;4242
          </p>
          <p className="mt-3 text-[10px] text-white/60">SAMPLE CARD · PREVIEW ONLY</p>
        </div>

        {complete ? (
          <div aria-live="polite" className="rounded-lg border border-green-800/20 bg-green-50 p-4">
            <p className="font-semibold text-green-900">Demo completed successfully</p>
            <p className="mt-1 text-sm text-green-900/80">
              This was a simulation: no payment was made and no subscription was created.
            </p>
            <Link
              className="mt-4 inline-block text-sm underline underline-offset-2"
              href="/preview"
            >
              Return to preview
            </Link>
          </div>
        ) : (
          <>
            <button
              className="w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
              onClick={() => setComplete(true)}
              type="button"
            >
              Simulate payment
            </button>
            <p className="mt-2 text-center text-[11px] text-black/50">
              This button does not contact any payment service.
            </p>
            <Link
              className="mt-4 block text-center text-sm underline underline-offset-2"
              href="/preview"
            >
              Cancel and return to preview
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
