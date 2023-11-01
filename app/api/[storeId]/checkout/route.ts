import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

// enable API calls across different url (localhost 3000/3001/etc) 
const enableCors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS(){
    return NextResponse.json({}, { headers: enableCors });
}

export async function POST (
    req: Request,
    { params }: { params: {storeId: string}}
){
    const { productIds } = await req.json();

    if(!productIds || productIds.length === 0) {
        return new NextResponse("Product Id is required", { status: 400})
    }

    // find all products which match the productIds
    const products = await prisma?.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    })

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products?.forEach((product) => {
        line_items.push({
            quantity: 1,
            price_data: {
                currency: "SGD",
                product_data: {
                    name: product.name
                },
                unit_amount: product.price.toNumber() * 100
            }
        });
    });

    const order = await prismadb.order.create({
        data: {
          storeId: params.storeId,
          isPaid: false,
          orderItems: {
            create: productIds.map((productId: string) => ({
              product: {
                connect: {
                  id: productId
                }
              }
            }))
          }
        }
      });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
            enabled: true
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=888`, // trigger the searchParams at frontend for "success" toast message
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=888`, // trigger the "cancel" toast message
        metadata: {
            orderId: order.id
        }
    });

    return NextResponse.json({ url: session.url}, {
        headers: enableCors,
    })

}