import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOKS_SECRET!,
        )
    } catch (error:any) {
        return new NextResponse(`Webhooks Error: ${error.message}`, {status: 400});
    }

    // create a session and capture the billing address required in stripe session fields
    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressLinesItems = [
        address?.line1,
        address?.line2,
        address?.postal_code,
        address?.country,
    ];

    const addressString = addressLinesItems.filter((line) => line !== null).join(',');

    // if payment is successful, find the order in database and update it
    if(event.type === "checkout.session.completed"){
        const order = await prismadb.order.update({
            where: {
                id: session?.metadata?.orderId,
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || ''
            },
            include: {
                orderItems: true,
            }
        });

        const productIds =  order.orderItems.map((orderItem) => orderItem.productId);

        // archive the product once sold
        await prismadb.product.updateMany({
            where: {
                id: {
                    in: [...productIds]
                }
            },
            data: {
                isArchived: true,
            }
        });
    }

    return new NextResponse(null, {status: 200})
}