export async function POST(req) {
  const body = await req.text();

  const signature =
    req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err.message}`,
      { status: 400 }
    );
  }

  if (
    event.type ===
    "checkout.session.completed"
  ) {
    const session = event.data.object;

    console.log("Pago realizado");

    console.log(session.metadata.userId);
  }

  return Response.json({
    received: true,
  });
}