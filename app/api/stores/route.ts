import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb";

export async function POST (
    req: Request,
) {
    try {
        const { userId } = auth(); // use clerk to authenticate if the userId exists 
        const body = await req.json(); // need name and userId for the post request, the other 3 parameters have default values
        const { name } = body;

        if(!userId) {
            return new NextResponse("Unauthorised", {status: 401});
        }
        if (!name) {
            return new NextResponse("Unauthorised", {status: 400});
        }

        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        })

        return NextResponse.json(store)

    } catch (error) {
        console.log("[STORES_POST]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}