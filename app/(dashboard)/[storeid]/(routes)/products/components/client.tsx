"use client"

import { PlusSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface ProductClientProps {
    data: ProductColumn[]
}

const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between" >
                <Heading
                title={`Products (${data.length})`}
                description="Manage products settings" 
                />
                <Button onClick={()=> router.push(`/${params.storeId}/products/new`)}>
                    <PlusSquare className="mr-2 h-5 w-5"/>
                    Add new
                </Button>
            </div>
            <Separator />
            {/* the "name" must be the data props parse into the cilent  */}
            <DataTable filterKey="name" columns={columns} data={data}/> 
            <Heading title="API" description="List of API calls for Products"/>
            <Separator />
            <ApiList entityName="products" entityIdName="productId"/>
        </>
     );
}
 
export default ProductClient;