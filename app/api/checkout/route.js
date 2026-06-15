import { stripe } from "@/lib/stripe";


export async function POST(req) {
  try {
    const { priceId } = await req.json();

    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",

        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],

        success_url:
          "http://localhost:3000/planes",

        cancel_url:
          "http://localhost:3000",
      });

    return Response.json({
      url: session.url,
    });

  } catch (error) {
    console.log("ERROR CHECKOUT:", error);

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}