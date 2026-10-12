import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react"
import { company } from "../data/company"
import {
  buildMailto,
  buildMessage,
  emptyInquiry,
  projectTypes,
  validateInquiry,
  type Inquiry,
  type InquiryErrors,
  type InquiryField,
} from "../lib/inquiry"
import { useReveal } from "../hooks/useReveal"
import { stagger } from "../lib/motion"
import Arrow from "./Arrow"

const fieldOrder: InquiryField[] = [
  "name",
  "phone",
  "email",
  "projectType",
  "details",
]

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string
  label: string
  error?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional && <span className="optional"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function Contact() {
  const [values, setValues] = useState<Inquiry>(emptyInquiry)
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [composed, setComposed] = useState(false)
  const [copied, setCopied] = useState(false)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const ref = useReveal<HTMLDivElement>()

  const update =
    (key: keyof Inquiry) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
      setValues((current) => ({ ...current, [key]: event.target.value }))
      setComposed(false)
      setCopied(false)
    }

  const describe = (key: InquiryField) =>
    errors[key] ? `inq-${key}-error` : undefined

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const found = validateInquiry(values)
    setErrors(found)
    const firstInvalid = fieldOrder.find((key) => found[key])
    if (firstInvalid) {
      document.getElementById(`inq-${firstInvalid}`)?.focus()
      return
    }
    setComposed(true)
    window.location.href = buildMailto(company.emails[0], values)
  }

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(buildMessage(values))
      setCopied(true)
    } catch {
      messageRef.current?.select()
    }
  }

  return (
    <section
      id="contact"
      className="contact on-dark"
      aria-labelledby="contact-title"
    >
      <div className="wrap reveal-scope" ref={ref}>
        <h2
          id="contact-title"
          className="big contact-title reveal-item"
          style={stagger(0)}
        >
          Let’s build what’s <span>next.</span>
        </h2>
        <p className="contact-intro reveal-item" style={stagger(1)}>
          Tell us about your lot, your building or your idea. We will get back
          to you by phone or email.
        </p>

        <div className="contact-grid">
          <form
            className="inquiry reveal-item"
            style={stagger(2)}
            onSubmit={onSubmit}
            noValidate
          >
            <Field id="inq-name" label="Your name" error={errors.name}>
              <input
                id="inq-name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={update("name")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describe("name")}
              />
            </Field>
            <Field id="inq-phone" label="Phone number" error={errors.phone}>
              <input
                id="inq-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={update("phone")}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={describe("phone")}
              />
            </Field>
            <Field id="inq-email" label="Email" optional error={errors.email}>
              <input
                id="inq-email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={update("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describe("email")}
              />
            </Field>
            <Field
              id="inq-projectType"
              label="Project type"
              error={errors.projectType}
            >
              <select
                id="inq-projectType"
                value={values.projectType}
                onChange={update("projectType")}
                aria-invalid={Boolean(errors.projectType)}
                aria-describedby={describe("projectType")}
              >
                <option value="">Choose one</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="inq-location" label="Project location" optional>
              <input
                id="inq-location"
                type="text"
                autoComplete="address-level2"
                value={values.location}
                onChange={update("location")}
              />
            </Field>
            <Field
              id="inq-details"
              label="Tell us about the project"
              error={errors.details}
            >
              <textarea
                id="inq-details"
                rows={5}
                value={values.details}
                onChange={update("details")}
                aria-invalid={Boolean(errors.details)}
                aria-describedby={describe("details")}
              />
            </Field>
            <button className="btn btn-red" type="submit">
              Start a project <Arrow diagonal />
            </button>

            {composed && (
              <div className="composed" role="status">
                <p>
                  Your email app should open with this message ready to send. If
                  it did not, copy the message and email it to{" "}
                  {company.emails[0]}, or call {company.phones[0].label}.
                </p>
                <textarea
                  ref={messageRef}
                  readOnly
                  rows={6}
                  value={buildMessage(values)}
                  aria-label="Your message"
                />
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={copyMessage}
                >
                  {copied ? "Copied" : "Copy message"}
                </button>
              </div>
            )}
          </form>

          <div className="contact-info reveal-item" style={stagger(3)}>
            <span className="c-label mono">Email</span>
            {company.emails.map((email) => (
              <a className="c-link" href={`mailto:${email}`} key={email}>
                {email}
              </a>
            ))}
            <span className="c-label mono">Call</span>
            {company.phones.map((phone) => (
              <a className="c-link" href={phone.href} key={phone.href}>
                {phone.label}
              </a>
            ))}
            <span className="c-label mono">Visit our office</span>
            <p>{company.address}</p>
            <a
              className="u-link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Find our office <Arrow diagonal />
            </a>
            <span className="c-label mono">Follow our work</span>
            <div className="socials">
              {company.socials.map((social) => (
                <a
                  className="u-link"
                  href={social.href}
                  key={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label} <Arrow diagonal />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
