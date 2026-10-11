import assert from "node:assert/strict";
import test from "node:test";
import { requestSchema } from "../src/lib/request-schema.ts";

const validPayload = {
  name: "Alex Morgan",
  email: "alex@example.com",
  service: "Workflow Automation",
  description: "Automate our reports", // Exactly 20 characters: the accepted minimum.
};

function assertFieldRejected(payload, field) {
  const result = requestSchema.safeParse(payload);
  assert.equal(result.success, false, `Expected ${field} to fail validation`);
  assert.ok(
    result.error.issues.some((issue) => issue.path[0] === field),
    `Expected a validation issue for ${field}`,
  );
}

test("a valid request with exactly 20 description characters passes validation", () => {
  assert.equal(validPayload.description.length, 20);
  const result = requestSchema.safeParse(validPayload);
  assert.equal(result.success, true);
  assert.deepEqual(result.data, validPayload);
});

test("an invalid email is rejected", () => {
  assertFieldRejected({ ...validPayload, email: "not-an-email" }, "email");
});

test("a description below the minimum length is rejected", () => {
  assert.equal("Automate our report".length, 19);
  assertFieldRejected(
    { ...validPayload, description: "Automate our report" }, // 19 characters.
    "description",
  );
});

for (const field of Object.keys(validPayload)) {
  test(`a missing required ${field} is rejected`, () => {
    const payload = { ...validPayload };
    delete payload[field];
    assertFieldRejected(payload, field);
  });
}

for (const field of Object.keys(validPayload)) {
  test(`whitespace-only ${field} is rejected`, () => {
    assertFieldRejected({ ...validPayload, [field]: " \t\n " }, field);
  });
}

test("an unknown service is rejected", () => {
  assertFieldRejected({ ...validPayload, service: "Unknown service" }, "service");
});

for (const [field, value] of [
  ["name", "n".repeat(101)],
  ["email", `${"a".repeat(243)}@example.com`],
  ["description", "d".repeat(5001)],
]) {
  test(`over-maximum ${field} length is rejected`, () => {
    assertFieldRejected({ ...validPayload, [field]: value }, field);
  });
}

test("unknown extra fields are stripped", () => {
  const result = requestSchema.safeParse({ ...validPayload, id: 123, created_at: "2020-01-01", extra: true });
  assert.equal(result.success, true);
  assert.deepEqual(result.data, validPayload);
});
