import { z } from "zod";
export const serviceOptions = ["Workflow Automation", "AI Assistant Integration", "Data & Reporting Automation"] as const;
export const requestSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters for your name.").max(100, "Keep your name under 100 characters."),
  email: z.string().trim().max(254, "Keep your email under 254 characters.").pipe(z.email("Enter a valid email address.")),
  service: z.enum(serviceOptions, { error: "Choose a service." }),
  description: z.string().trim().min(20, "Tell us a little more (at least 20 characters).").max(5000, "Keep your description under 5,000 characters."),
});
export type RequestInput = z.infer<typeof requestSchema>;
export type FieldErrors = Partial<Record<keyof RequestInput, string[]>>;
