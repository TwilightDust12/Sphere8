import test from "node:test"
import assert from "node:assert/strict"
import {
  MAILTO_BODY_LIMIT,
  buildMailto,
  buildMessage,
  emptyInquiry,
  validateInquiry,
  type Inquiry,
} from "./inquiry.ts"

const valid: Inquiry = {
  name: "Maria Santos",
  phone: "0917-675-7221",
  email: "maria@example.com",
  projectType: "New house or residence",
  location: "Lucena City",
  details: "Two-storey house on a 300 sqm lot, looking for design and build.",
}

test("a complete inquiry has no errors", () => {
  assert.deepEqual(validateInquiry(valid), {})
})

test("an empty inquiry flags every required field but not the optional email", () => {
  const errors = validateInquiry(emptyInquiry)
  assert.deepEqual(Object.keys(errors).sort(), [
    "details",
    "name",
    "phone",
    "projectType",
  ])
})

test("phone numbers with spaces, dashes and a country code are accepted", () => {
  for (const phone of ["+63 920 969 8592", "(042) 373-3695", "09176757221"]) {
    assert.equal(validateInquiry({ ...valid, phone }).phone, undefined, phone)
  }
})

test("phone numbers with fewer than 7 digits are flagged", () => {
  assert.ok(validateInquiry({ ...valid, phone: "123-45" }).phone)
})

test("email is optional but validated when present", () => {
  assert.equal(validateInquiry({ ...valid, email: "" }).email, undefined)
  assert.ok(validateInquiry({ ...valid, email: "maria@" }).email)
})

test("details shorter than 10 characters are flagged", () => {
  assert.ok(validateInquiry({ ...valid, details: "house" }).details)
})

test("mailto url is a single encoded line with the subject and the details", () => {
  const url = buildMailto("sphere8construction@gmail.com", valid)
  assert.ok(url.startsWith("mailto:sphere8construction@gmail.com?subject="))
  assert.ok(!/\s/.test(url), "url must not contain raw whitespace")
  assert.ok(
    decodeURIComponent(url).includes("Two-storey house on a 300 sqm lot"),
  )
  assert.ok(decodeURIComponent(url).includes("Project inquiry - Sphere8"))
})

test("very long details are shortened in the mailto but kept in the message", () => {
  const long = "x".repeat(MAILTO_BODY_LIMIT * 3)
  const input = { ...valid, details: long }
  const url = buildMailto("a@b.co", input)
  assert.ok(url.length < MAILTO_BODY_LIMIT * 3 + 400)
  assert.ok(buildMessage(input).includes(long))
})

test("the message leaves out empty optional fields", () => {
  const message = buildMessage({ ...valid, email: "", location: "" })
  assert.ok(!message.includes("Email:"))
  assert.ok(!message.includes("Location:"))
  assert.ok(message.includes("Name: Maria Santos"))
})

test("surrounding whitespace is trimmed", () => {
  const message = buildMessage({ ...valid, name: "  Maria Santos  " })
  assert.ok(message.includes("Name: Maria Santos\n"))
})

test("shortening never splits an emoji in half", () => {
  for (let n = 1300; n <= MAILTO_BODY_LIMIT; n++) {
    const input = { ...valid, details: "a".repeat(n) + "\u{1F600}".repeat(5) }
    assert.doesNotThrow(() => buildMailto("a@b.co", input), `pad length ${n}`)
  }
})
