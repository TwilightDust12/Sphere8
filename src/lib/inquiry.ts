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

/** Longest mailto URL (encoded) we hand to a mail client; Windows handlers cut near 2000. */
export const MAILTO_URL_LIMIT = 1900

const SUBJECT = "Project inquiry - Sphere8"
const SHORTENED_NOTE = "\n[message shortened to fit an email link]"

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
  if (!input.projectType)
    errors.projectType = "Choose the closest project type."
  if (input.details.trim().length < 10) {
    errors.details =
      "Tell us a little about the project, at least 10 characters."
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

function mailtoFor(to: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(body)}`
}

/** Name of the Netlify form declared in public/forms.html. */
export const FORM_NAME = "inquiry"

/** URL-encoded body for the Netlify Forms POST. "bot-field" is the honeypot and must stay empty. */
export function buildFormBody(input: Inquiry): string {
  return new URLSearchParams({
    "form-name": FORM_NAME,
    "bot-field": "",
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    projectType: input.projectType,
    location: input.location.trim(),
    details: input.details.trim(),
  }).toString()
}

export function isShortened(to: string, input: Inquiry): boolean {
  return mailtoFor(to, buildMessage(input)).length > MAILTO_URL_LIMIT
}

export function buildMailto(to: string, input: Inquiry): string {
  const full = buildMessage(input)
  if (mailtoFor(to, full).length <= MAILTO_URL_LIMIT) return mailtoFor(to, full)
  // cut by code points, so an emoji is never split, until the encoded URL fits
  const chars = Array.from(full)
  let low = 0
  let high = chars.length
  while (low < high) {
    const mid = Math.ceil((low + high) / 2)
    const candidate = mailtoFor(
      to,
      chars.slice(0, mid).join("") + SHORTENED_NOTE,
    )
    if (candidate.length <= MAILTO_URL_LIMIT) low = mid
    else high = mid - 1
  }
  return mailtoFor(to, chars.slice(0, low).join("") + SHORTENED_NOTE)
}
