import assert from "node:assert/strict";
import test from "node:test";
import { createRequestHandler } from "../src/lib/request-handler.ts";

const valid = {
  name: "Alex Morgan", email: "alex@example.com",
  service: "Workflow Automation", description: "Automate our reports.",
};
const makeRequest = (body, contentType = "application/json") => new Request("http://localhost/api/requests", {
  method: "POST",
  headers: contentType ? { "Content-Type": contentType } : {},
  body,
});

function setup(insert = async () => ({ error: null })) {
  const inserts = [];
  const logs = [];
  return {
    inserts, logs,
    handler: createRequestHandler({
      insert: async (payload) => { inserts.push(payload); return insert(payload); },
      logError: (context, error) => logs.push({ context, error }),
    }),
  };
}

for (const [label, body] of [["malformed JSON", "{"], ["invalid payload", JSON.stringify({ ...valid, email: "invalid" })]]) {
  test(`${label} returns 400 without inserting`, async () => {
    const { handler, inserts } = setup();
    const response = await handler(makeRequest(body));
    assert.equal(response.status, 400);
    assert.equal(inserts.length, 0);
    assert.equal(typeof (await response.json()).message, "string");
  });
}

for (const contentType of [null, "text/plain"]) {
  test(`content type ${contentType} returns 415 without inserting`, async () => {
    const { handler, inserts } = setup();
    assert.equal((await handler(makeRequest(JSON.stringify(valid), contentType))).status, 415);
    assert.equal(inserts.length, 0);
  });
}

test("a successful insert returns 201 and passes validated fields", async () => {
  const { handler, inserts, logs } = setup();
  const response = await handler(makeRequest(JSON.stringify(valid), "application/json; charset=utf-8"));
  assert.equal(response.status, 201);
  assert.deepEqual(inserts, [valid]);
  assert.equal(logs.length, 0);
  assert.match((await response.json()).message, /saved/);
});

for (const throws of [false, true]) {
  test(`${throws ? "thrown insert failure" : "Supabase insert error"} returns a generic 500`, async () => {
    const error = new Error("Private database diagnostic");
    const { handler, logs } = setup(async () => {
      if (throws) throw error;
      return { error };
    });
    const response = await handler(makeRequest(JSON.stringify(valid)));
    assert.equal(response.status, 500);
    assert.equal((await response.json()).message, "We couldn’t save your request. Please try again shortly.");
    assert.equal(logs.length, 1);
    assert.equal(logs[0].error, error);
  });
}

test("extra id and created_at fields are not passed to insert", async () => {
  const { handler, inserts } = setup();
  const response = await handler(makeRequest(JSON.stringify({ ...valid, id: 123, created_at: "2020-01-01", extra: true })));
  assert.equal(response.status, 201);
  assert.deepEqual(inserts, [valid]);
});
