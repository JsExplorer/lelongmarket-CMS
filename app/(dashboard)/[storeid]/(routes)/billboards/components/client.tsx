"use client"

import { PlusSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface BillboardClientProps {
    data: BillboardColumn[]
}

const BillboardClient: React.FC<BillboardClientProps> = ({
    data
}) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between" >
                <Heading
                title={`Billboards (${data.length})`}
                description="Manage billboards settings" 
                />
                <Button onClick={()=> router.push(`/${params.storeId}/billboards/new`)}>
                    <PlusSquare className="mr-2 h-5 w-5"/>
                    Add new
                </Button>
            </div>
            <Separator />
            <DataTable filterKey="label" columns={columns} data={data}/>
            <Heading title="API" description="List of API calls for billboard"/>
            <Separator />
            <ApiList entityName="billboards" entityIdName="billboardId"/>
        </>
     );
}
 
export default BillboardClient;