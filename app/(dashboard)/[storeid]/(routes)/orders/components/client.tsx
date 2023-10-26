"use client"

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
    data: OrderColumn[]
}

const OrderClient: React.FC<OrderClientProps> = ({
    data
}) => {

    return (
        <>
            <div className="flex items-center justify-between" >
                <Heading
                title={`Orders (${data.length})`}
                description="Manage orders settings" 
                />
            </div>
            <Separator />
            <DataTable filterKey="products" columns={columns} data={data}/>
        </>
     );
}
 
export default OrderClient;