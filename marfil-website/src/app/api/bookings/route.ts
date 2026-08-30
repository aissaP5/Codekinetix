import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bookingSchema = z.object({
  name: z.string().min(2, "Please tell us your name").max(120),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Please enter a valid phone number").max(40),
  treatment: z.string().min(1, "Please choose a treatment").max(80),
  date: z.string().min(1, "Please choose a preferred date").max(40),
  message: z.string().max(1000).optional().nullable(),
});

// Static handoff build: no database attached. Validation still runs,
// then the request is politely declined so the UI shows its fallback
// ("call us") toast instead of a server crash.
export async function POST(req: NextRequest) {
  try {
    const parsed = bookingSchema.safeParse(await req.json());

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid request";
      return NextResponse.json({ ok: false, error: firstError }, { status: 400 });
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          "Online booking is not connected in this build — please call +34 910 24 47 47 or write to hola@marfil.es",
      },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again or call us." },
      { status: 500 }
    );
  }
}
