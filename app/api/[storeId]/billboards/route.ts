import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb";

export async function GET (
    req: Request,
    { params} : { params: {storeId: string}} 
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store id is required", {status: 400});
        }

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboards)

    } catch (error) {
        console.log("[BILLBOARD_GET]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}


export async function POST (
    req: Request,
    { params} : { params: {storeId: string}} 
) {
    try {
        const { userId } = auth(); // use clerk to authenticate if the userId exists 
        const body = await req.json(); // need name and userId for the post request, the other 3 parameters have default values
        const { label, imageUrl } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }
        if (!label) {
            return new NextResponse("Label is required", {status: 400});
        }
        if (!imageUrl) {
            return new NextResponse("ImageURL is required", {status: 400});
        }
        if (!params.storeId) {
            return new NextResponse("Store id is required", {status: 400});
        }

        // ensuring the store is unique to the specific user only and not updating other users' store
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Forbidden request", {status: 403});
        }

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log("[BILLBOARD_POST]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}