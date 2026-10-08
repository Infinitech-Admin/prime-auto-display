// Path: app/checkout/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { placeOrder, type ApiError } from "@/lib/api";

/*
  Prime Auto Display palette
  dark #1C0606 | page #150404 | panel #2A0A0A | input #2E0C0C (focus #3A1212)
  maroon #9B1111 | gold #F9A602 | cream #FDF5DC
*/

// ---------------------------------------------------------------------------
// ADJUST: payment settings
// ---------------------------------------------------------------------------
const DOWNPAYMENT_RATE = 0.2; // 20%, keep in sync with OrderController.php
const MAX_PROOF_SIZE_MB = 5;

// Lets guests who already have an account log in and come back.
const CHECKOUT_PATH = "/checkout";
const LOGIN_URL = `/login?redirect=${encodeURIComponent(CHECKOUT_PATH)}`;

type PaymentMethodId = "gcash" | "maya" | "bank";

const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  bankName?: string;
  accountName: string;
  accountNumber: string; // shown to the customer
  copyValue: string; // what the copy button copies
}[] = [
  {
    id: "gcash",
    label: "GCash",
    accountName: "Justin De Castro",
    accountNumber: "0945 675 4591",
    copyValue: "09456754591",
  },
  {
    id: "maya",
    label: "Maya",
    accountName: "Justin De Castro",
    accountNumber: "0945 675 4591",
    copyValue: "09456754591",
  },
  {
    id: "bank",
    label: "Bank transfer",
    bankName: "YOUR BANK NAME", // ADJUST
    accountName: "Justin De Castro",
    accountNumber: "0000 0000 0000", // ADJUST
    copyValue: "000000000000", // ADJUST
  },
];
// ---------------------------------------------------------------------------

const getPriceValue = (price: string) => Number(price.replace(/[₱,]/g, ""));
const formatPrice = (value: number) =>
  `₱${value.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  reference: string;
};
type ErrorKey = keyof FormState | "proof";

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
  reference: "",
};

// Laravel field name -> form field name (for 422 validation errors)
const serverFieldMap: Record<string, ErrorKey> = {
  full_name: "fullName",
  email: "email",
  phone: "phone",
  address: "address",
  notes: "notes",
  payment_reference: "reference",
  payment_proof: "proof",
};

const ring =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9A602]";
const inputClass =
  "w-full border-2 border-[#FDF5DC]/15 bg-[#2E0C0C] px-4 py-3.5 text-[#FDF5DC] placeholder:text-[#FDF5DC]/35 outline-none transition-colors focus:border-[#F9A602] focus:bg-[#3A1212] aria-[invalid=true]:border-[#FF5A61]";
const panel = "border-t-4 border-[#F9A602] bg-[#2A0A0A]";
const goldBtn = `chamfer inline-flex items-center justify-center gap-2 bg-[#F9A602] px-7 py-4 text-sm font-bold uppercase tracking-wider text-[#1C0606] transition-colors hover:bg-[#FDF5DC] ${ring}`;
const ghostBtn = `inline-flex items-center justify-center border-2 border-[#FDF5DC]/25 px-7 py-4 text-sm font-bold uppercase tracking-wider transition-colors hover:border-[#F9A602] hover:text-[#F9A602] ${ring}`;

function Field({
  id,
  label,
  optional,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
        {optional && (
          <span className="ml-1.5 font-normal text-[#FDF5DC]/45">
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="mt-2 text-sm font-medium text-[#FF5A61]">{error}</p>
      )}
    </div>
  );
}

// Numbered step: the three sections really are a sequence.
function Step({
  n,
  title,
  hint,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className={`${panel} p-5 sm:p-8`}>
      <div className="flex items-center gap-4">
        <span className="chamfer flex h-10 w-10 shrink-0 items-center justify-center bg-[#9B1111] text-lg font-black text-[#F9A602]">
          {n}
        </span>
        <div>
          <h2 className="text-2xl font-black uppercase leading-none">
            {title}
          </h2>
          {hint && <p className="mt-1.5 text-sm text-[#FDF5DC]/65">{hint}</p>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Shell({
  children,
  center,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <>
      <Navbar />
      <main
        className={`min-h-screen bg-[#150404] text-[#FDF5DC] ${center ? "flex items-center justify-center px-4 py-16" : ""}`}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  // Logged-in users get their details prefilled; guests just fill in the form.
  const { user } = useAuth();
  const { items, clearCart, isHydrated } = useCart();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [submittedAsGuest, setSubmittedAsGuest] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("gcash");
  const [proof, setProof] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setForm((c) => ({
      ...c,
      fullName: c.fullName || user.name || "",
      email: c.email || user.email || "",
      phone: c.phone || user.phone || "",
    }));
  }, [user]);

  useEffect(() => {
    if (!proof) {
      setProofPreview("");
      return;
    }
    const url = URL.createObjectURL(proof);
    setProofPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [proof]);

  const total = useMemo(
    () => items.reduce((s, i) => s + getPriceValue(i.price) * i.quantity, 0),
    [items],
  );
  const downpayment = Math.round(total * DOWNPAYMENT_RATE);
  const balance = total - downpayment;
  const pct = Math.round(DOWNPAYMENT_RATE * 100);

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod)!;

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((c) => ({ ...c, [field]: e.target.value }));
      setErrors((c) => ({ ...c, [field]: undefined }));
    };

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((c) => ({ ...c, proof: "Please upload an image file." }));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PROOF_SIZE_MB * 1024 * 1024) {
      setErrors((c) => ({
        ...c,
        proof: `Image must be ${MAX_PROOF_SIZE_MB}MB or smaller.`,
      }));
      e.target.value = "";
      return;
    }
    setProof(file);
    setErrors((c) => ({ ...c, proof: undefined }));
  };

  const removeProof = () => {
    setProof(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(selectedMethod.copyValue);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable, ignore
    }
  };

  const validate = (): boolean => {
    const next: Partial<Record<ErrorKey, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    if (!form.address.trim())
      next.address = "Delivery / pickup address is required.";
    if (!proof) next.proof = "Upload your payment screenshot.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0 || !validate() || !proof) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Multipart, because we're uploading the screenshot.
      const data = new FormData();
      data.append("full_name", form.fullName.trim());
      data.append("email", form.email.trim());
      data.append("phone", form.phone.trim());
      data.append("address", form.address.trim());
      if (form.notes.trim()) data.append("notes", form.notes.trim());

      // Only ids + quantities. The server calculates prices and the 20%.
      items.forEach((item, i) => {
        data.append(`items[${i}][vehicle_id]`, String(item.id));
        data.append(`items[${i}][quantity]`, String(item.quantity));
      });

      data.append("payment_method", paymentMethod);
      if (form.reference.trim())
        data.append("payment_reference", form.reference.trim());
      data.append("payment_proof", proof);

      const result = await placeOrder(data);

      setSubmittedAsGuest(!user);
      setOrderNumber(result?.data?.order_number ?? "");
      setPaidAmount(Number(result?.data?.downpayment ?? downpayment));
      setIsSubmitted(true);
      clearCart();
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr?.errors) {
        const fieldErrors: Partial<Record<ErrorKey, string>> = {};
        for (const [key, messages] of Object.entries(apiErr.errors)) {
          const field = serverFieldMap[key];
          if (field) fieldErrors[field] = messages[0];
        }
        setErrors(fieldErrors);
      }
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------------ SUCCESS ------------------------------ */
  if (isSubmitted) {
    return (
      <Shell center>
        <div
          className={`${panel} w-full max-w-lg px-6 py-12 text-center sm:px-10`}
        >
          <span className="chamfer mx-auto flex h-16 w-16 items-center justify-center bg-[#9B1111] text-[#F9A602]">
            <CheckCircle2 size={30} />
          </span>
          <h1 className="mt-6 text-4xl font-black uppercase leading-none">
            Order submitted
          </h1>

          {orderNumber && (
            <p className="mx-auto mt-5 w-fit border-l-4 border-[#F9A602] bg-[#1C0606] px-5 py-3 text-left">
              <span className="block text-xs font-semibold text-[#FDF5DC]/55">
                Order number
              </span>
              <span className="block text-2xl font-black text-[#F9A602]">
                {orderNumber}
              </span>
            </p>
          )}

          <p className="mt-5 text-sm leading-7 text-[#FDF5DC]/75">
            We&apos;ll verify your {formatPrice(paidAmount)} downpayment, then a
            sales advisor will contact you to confirm the next steps.
          </p>

          {submittedAsGuest && (
            <p className="mt-4 bg-[#1C0606] px-4 py-3 text-xs leading-5 text-[#FDF5DC]/65">
              Save your order number. You&apos;ll need it, with the email you
              used, when you contact us about this order.
            </p>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/showroom" className={goldBtn}>
              Continue browsing
            </Link>
            <Link href="/" className={ghostBtn}>
              Back to home
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  // Wait for the saved cart so we don't flash "Your cart is empty".
  if (!isHydrated) {
    return (
      <Shell>
        <div className="min-h-screen" />
      </Shell>
    );
  }

  if (items.length === 0) {
    return (
      <Shell center>
        <div className={`${panel} w-full max-w-md px-6 py-14 text-center`}>
          <h1 className="text-3xl font-black uppercase">Your cart is empty</h1>
          <p className="mt-2 text-sm text-[#FDF5DC]/65">
            Add a car to your cart before checking out.
          </p>
          <Link href="/showroom" className={`${goldBtn} mt-6`}>
            Browse showroom
          </Link>
        </div>
      </Shell>
    );
  }

  /* ------------------------------- FORM -------------------------------- */
  return (
    <Shell>
      {/* HEADER */}
      <section className="relative overflow-hidden bg-[#1C0606]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 hidden h-full w-72 -skew-x-12 bg-[#9B1111] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-0 hidden h-full w-6 -skew-x-12 bg-[#F9A602] lg:block"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link
            href="/cart"
            className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#F9A602] ${ring}`}
          >
            <ArrowLeft size={16} className="text-[#F9A602]" />
            Back to cart
          </Link>
          <div className="mt-6 border-l-8 border-[#F9A602] pl-5 sm:pl-8">
            <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
              Checkout
            </h1>
            <p className="mt-3 text-base text-[#FDF5DC]/70">
              {user ? (
                `Reserve your car with a ${pct}% downpayment.`
              ) : (
                <>
                  Checking out as a guest, no account needed.{" "}
                  <Link
                    href={LOGIN_URL}
                    className="font-semibold text-[#F9A602] underline underline-offset-2 transition-colors hover:text-[#FDF5DC]"
                  >
                    Have an account? Log in
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
        <div aria-hidden="true" className="tread" />
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* 1. DETAILS */}
            <Step
              n={1}
              title="Your details"
              hint="We use these to confirm your order."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="fullName"
                  label="Full name"
                  error={errors.fullName}
                  className="sm:col-span-2"
                >
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    placeholder="Juan Dela Cruz"
                    aria-invalid={Boolean(errors.fullName)}
                    className={inputClass}
                  />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="you@email.com"
                    aria-invalid={Boolean(errors.email)}
                    className={inputClass}
                  />
                </Field>
                <Field id="phone" label="Phone number" error={errors.phone}>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="09XX XXX XXXX"
                    aria-invalid={Boolean(errors.phone)}
                    className={inputClass}
                  />
                </Field>
                <Field
                  id="address"
                  label="Delivery / pickup address"
                  error={errors.address}
                  className="sm:col-span-2"
                >
                  <input
                    id="address"
                    type="text"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={handleChange("address")}
                    placeholder="Street, City, Province"
                    aria-invalid={Boolean(errors.address)}
                    className={inputClass}
                  />
                </Field>
                <Field
                  id="notes"
                  label="Notes"
                  optional
                  error={errors.notes}
                  className="sm:col-span-2"
                >
                  <textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={handleChange("notes")}
                    placeholder="Preferred schedule, financing questions, trade-in details..."
                    className={`${inputClass} resize-none`}
                  />
                </Field>
              </div>
            </Step>

            {/* 2. PAY */}
            <Step
              n={2}
              title={`Send the ${pct}% downpayment`}
              hint="Use any method below."
            >
              <div
                role="radiogroup"
                aria-label="Payment method"
                className="grid grid-cols-3 gap-2 sm:gap-3"
              >
                {PAYMENT_METHODS.map((m) => {
                  const active = m.id === paymentMethod;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`border-2 px-3 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors ${ring} ${
                        active
                          ? "border-[#F9A602] bg-[#F9A602] text-[#1C0606]"
                          : "border-[#FDF5DC]/20 hover:border-[#F9A602] hover:text-[#F9A602]"
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>

              <dl className="mt-5 space-y-3 border-l-4 border-[#F9A602] bg-[#1C0606] p-5 text-sm">
                {selectedMethod.bankName && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-[#FDF5DC]/60">Bank</dt>
                    <dd className="font-semibold">{selectedMethod.bankName}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#FDF5DC]/60">Account name</dt>
                  <dd className="font-semibold">
                    {selectedMethod.accountName}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#FDF5DC]/60">
                    {selectedMethod.id === "bank" ? "Account number" : "Number"}
                  </dt>
                  <dd className="flex items-center gap-2 text-lg font-black">
                    {selectedMethod.accountNumber}
                    <button
                      type="button"
                      onClick={copyNumber}
                      aria-label="Copy account number"
                      className={`flex h-9 w-9 items-center justify-center border-2 border-[#FDF5DC]/25 transition-colors hover:border-[#F9A602] hover:text-[#F9A602] ${ring}`}
                    >
                      {copied ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-[#FDF5DC]/10 pt-3">
                  <dt className="text-[#FDF5DC]/60">Amount to send</dt>
                  <dd className="text-2xl font-black text-[#F9A602]">
                    {formatPrice(downpayment)}
                  </dd>
                </div>
              </dl>
            </Step>

            {/* 3. PROOF */}
            <Step
              n={3}
              title="Upload your receipt"
              hint="A screenshot of the payment confirmation."
            >
              <input
                ref={fileInputRef}
                id="proof"
                type="file"
                accept="image/*"
                onChange={handleProofChange}
                className="sr-only"
              />

              {proof ? (
                <div className="flex items-center gap-4 bg-[#1C0606] p-3">
                  {proofPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={proofPreview}
                      alt="Payment screenshot preview"
                      className="h-20 w-20 shrink-0 object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 shrink-0 bg-[#2A0A0A]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{proof.name}</p>
                    <p className="mt-1 text-xs text-[#FDF5DC]/55">
                      {(proof.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeProof}
                    aria-label="Remove screenshot"
                    className={`flex h-10 w-10 items-center justify-center border-2 border-[#FDF5DC]/25 transition-colors hover:border-[#F9A602] hover:bg-[#9B1111] ${ring}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed px-4 py-10 text-sm font-semibold transition-colors hover:border-[#F9A602] hover:bg-[#3A1212] ${ring} ${
                    errors.proof
                      ? "border-[#FF5A61] text-[#FF5A61]"
                      : "border-[#FDF5DC]/25 text-[#FDF5DC]/75"
                  }`}
                >
                  <Upload size={24} className="text-[#F9A602]" />
                  Tap to upload screenshot
                  <span className="text-xs font-normal text-[#FDF5DC]/50">
                    JPG, PNG or WEBP, up to {MAX_PROOF_SIZE_MB}MB
                  </span>
                </button>
              )}
              {errors.proof && (
                <p className="mt-2 text-sm font-medium text-[#FF5A61]">
                  {errors.proof}
                </p>
              )}

              <Field
                id="reference"
                label="Reference number"
                optional
                error={errors.reference}
                className="mt-5"
              >
                <input
                  id="reference"
                  type="text"
                  value={form.reference}
                  onChange={handleChange("reference")}
                  placeholder="e.g. GCash ref. no."
                  className={inputClass}
                />
              </Field>
            </Step>

            <div className="flex items-start gap-3 border-l-4 border-[#F9A602] bg-[#2A0A0A] p-4 text-sm leading-6 text-[#FDF5DC]/75">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-[#F9A602]"
              />
              Your order is confirmed once we verify your screenshot. We&apos;ll
              arrange the remaining {formatPrice(balance)} with your sales
              advisor.
            </div>

            {submitError && (
              <p
                role="alert"
                className="border-l-4 border-[#FF5A61] bg-[#9B1111]/25 px-4 py-3 text-sm font-medium text-[#FFB3B7]"
              >
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="chamfer flex w-full items-center justify-center gap-2 bg-[#9B1111] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#F9A602] hover:text-[#1C0606] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9A602] disabled:cursor-not-allowed disabled:bg-[#FDF5DC]/10 disabled:text-[#FDF5DC]/40 disabled:hover:bg-[#FDF5DC]/10 disabled:hover:text-[#FDF5DC]/40"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting
                ? "Submitting..."
                : `Submit order | ${formatPrice(downpayment)} downpayment`}
            </button>
          </form>

          {/* SUMMARY */}
          <aside className={`${panel} p-5 sm:p-7 lg:sticky lg:top-28`}>
            <h2 className="text-2xl font-black uppercase">Your order</h2>

            <ul className="mt-5 space-y-4 border-b border-[#FDF5DC]/10 pb-5">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden bg-[#F5E9C8]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        unoptimized
                        className="object-contain p-1"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold uppercase">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#FDF5DC]/55">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold">
                    {formatPrice(getPriceValue(item.price) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#FDF5DC]/65">Total price</dt>
                <dd className="font-bold">{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#FDF5DC]/65">Balance ({100 - pct}%)</dt>
                <dd className="font-bold">{formatPrice(balance)}</dd>
              </div>
              <div className="flex items-center justify-between bg-[#F9A602] px-4 py-3 text-[#1C0606]">
                <dt className="font-semibold">Due today ({pct}%)</dt>
                <dd className="text-2xl font-black">
                  {formatPrice(downpayment)}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
