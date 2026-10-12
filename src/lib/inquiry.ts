export const projectTypes = [
  "New house or residence",
  "Townhouse or apartment",
  "Commercial or office",
  "Warehouse or industrial",
  "Interior fit-out",
  "Structural design or review",
  "Architectural design",
  "Not sure yet",
] as const

export const MAILTO_BODY_LIMIT = 1500

export interface Inquiry {
  name: string
  phone: string
  email: string
  projectType: string
  location: string
  details: string
}

export type InquiryField = "name" | "phone" | "email" | "projectType" | "details"
export type InquiryErrors = Partial<Record<InquiryField, string>>

export const emptyInquiry: Inquiry = {
  name: "",
  phone: "",
  email: "",
  projectType: "",
  location: "",
  details: "",
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateInquiry(input: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {}
  if (!input.name.trim()) errors.name = "Enter your name."
  if (input.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter a phone number we can call, at least 7 digits."
  }
  const email = input.email.trim()
  if (email && !emailPattern.test(email)) {
    errors.email = "Check the email address, for example name@example.com."
  }
  if (!input.projectType) errors.projectType = "Choose the closest project type."
  if (input.details.trim().length < 10) {
    errors.details = "Tell us a little about the project, at least 10 characters."
  }
  return errors
}

export function buildMessage(input: Inquiry): string {
  const email = input.email.trim()
  const location = input.location.trim()
  const lines: (string | null)[] = [
    `Name: ${input.name.trim()}`,
    `Phone: ${input.phone.trim()}`,
    email ? `Email: ${email}` : null,
    `Project type: ${input.projectType}`,
    location ? `Location: ${location}` : null,
    "",
    "Details:",
    input.details.trim(),
  ]
  return lines.filter((line): line is string => line !== null).join("\n")
}

export function buildMailto(to: string, input: Inquiry): string {
  const subject = "Project inquiry - Sphere8"
  let body = buildMessage(input)
  if (body.length > MAILTO_BODY_LIMIT) {
    body = `${body.slice(0, MAILTO_BODY_LIMIT)}\n[message shortened to fit an email link]`
  }
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
