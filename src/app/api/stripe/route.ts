import prisma from "@/lib/db";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  //verify webhook came from stripe
  let event;
  try {
    event = stripe.webhook.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("webhook verification failed", err);
    return Response.json(null, { status: 404 });
  }

  //fulfill order
  switch (event.type) {
    case "checkout.session.completed":
      await prisma.user.update({
        where: {
          email: event.data.object.customer_email,
        },
        data: {
          hasAccess: true,
        },
      });
      break;
    default:
      console.log(`Unhandle event type${event.type}`);
  }

  //return 200 ok

  return Response.json(null, { status: 200 });
}
