"use client";
import { useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { requestSchema, serviceOptions, type FieldErrors, type RequestInput } from "@/lib/request-schema";
export function RequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);
  function focusFirstError(fieldErrors: FieldErrors) {
    const first = (["name", "email", "service", "description"] as const).find((field) => fieldErrors[field]?.length);
    if (first) (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setFeedback(null);
    const result = requestSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors(fieldErrors);
      focusFirstError(fieldErrors);
      return;
    }
    setErrors({});
    submitting.current = true;
    setPending(true);
    try {
      const response = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result.data) });
      const data = await response.json();
      if (!response.ok) {
        const fieldErrors: FieldErrors = data.errors ?? {};
        setErrors(fieldErrors);
        focusFirstError(fieldErrors);
        setFeedback({ type: "error", message: data.message ?? "We couldn’t save your request. Please try again." });
        return;
      }
      formRef.current?.reset();
      setFeedback({ type: "success", message: data.message });
    } catch {
      setFeedback({ type: "error", message: "We couldn’t confirm your submission. Check your connection and try again." });
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }
  function fieldProps(field: keyof RequestInput) {
    return { id: field, name: field, "aria-invalid": Boolean(errors[field]?.length), "aria-describedby": errors[field]?.length ? `${field}-error${field === "description" ? " description-hint" : ""}` : field === "description" ? "description-hint" : undefined };
  }
  function errorFor(field: keyof RequestInput) {
    return errors[field]?.length ? <p className="field-error" id={`${field}-error`}>{errors[field]?.[0]}</p> : null;
  }
  return (
    <form ref={formRef} onSubmit={handleSubmit} className="request-form" noValidate aria-busy={pending}>
      <p className="form-intro">Start a conversation <span>All fields are required</span></p>
      <fieldset disabled={pending}>
        <legend className="sr-only">Your automation request</legend>
        <div className="form-row"><div className="form-field"><label htmlFor="name">Your name</label><input {...fieldProps("name")} autoComplete="name" placeholder="Alex Morgan" required minLength={2} maxLength={100} />{errorFor("name")}</div><div className="form-field"><label htmlFor="email">Email address</label><input {...fieldProps("email")} type="email" autoComplete="email" placeholder="alex@company.com" required maxLength={254} />{errorFor("email")}</div></div>
        <div className="form-field"><label htmlFor="service">What can we help with?</label><select {...fieldProps("service")} defaultValue="" required><option value="" disabled>Select a service</option>{serviceOptions.map((service) => <option key={service} value={service}>{service}</option>)}</select>{errorFor("service")}</div>
        <div className="form-field"><label htmlFor="description">Tell us about your workflow</label><textarea {...fieldProps("description")} placeholder="What does your team do repeatedly, and which tools do you use?" required minLength={20} maxLength={5000} rows={5} /><p className="field-hint" id="description-hint">20–5,000 characters. Please don’t include passwords or sensitive data.</p>{errorFor("description")}</div>
        <button className="button submit-button" type="submit">{pending ? "Saving your request…" : "Send your request"}<span aria-hidden="true">{pending ? "…" : "↗"}</span></button>
      </fieldset>
      <div aria-live="polite" aria-atomic="true">{pending && <p className="field-hint">Please wait while we save your request.</p>}{feedback && <p className={`feedback ${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>{feedback.message}</p>}</div>
    </form>
  );
}
