import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { priceFormatter } from "@/lib/utils";

import ProductClient from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({ params } : { params: {storeId:string}}) => {
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isSelling: item.isSelling,
        isArchived: item.isArchived,
        price: priceFormatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name,
        createdAt : format(item.createdAt, "MMMM do, yyyy")
    }))

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
     );
}
 
export default ProductsPage