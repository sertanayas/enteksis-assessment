import { z } from "zod";
import { requestSchema, type RequestInput } from "./request-schema.ts";

type Dependencies = {
  insert: (payload: RequestInput) => PromiseLike<{ error: unknown }>;
  logError: (context: string, error: unknown) => void;
};

const serverError = () => Response.json(
  { message: "We couldn’t save your request. Please try again shortly." },
  { status: 500 },
);

// The production route supplies the server-only database adapter. Tests supply fakes.
export function createRequestHandler({ insert, logError }: Dependencies) {
  return async function POST(request: Request) {
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return Response.json({ message: "Send your request as application/json." }, { status: 415 });
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ message: "Send a valid JSON request." }, { status: 400 });
    }
    const result = requestSchema.safeParse(body);
    if (!result.success) {
      return Response.json({
        message: "Please check the highlighted fields.",
        errors: z.flattenError(result.error).fieldErrors,
      }, { status: 400 });
    }
    try {
      const { error } = await insert(result.data);
      if (error) {
        logError("Request insert failed", error);
        return serverError();
      }
      return Response.json({ message: "Your request has been saved. Thanks for telling us about your project!" }, { status: 201 });
    } catch (error) {
      logError("Request submission failed", error);
      return serverError();
    }
  };
}
