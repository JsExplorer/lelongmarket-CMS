"use client"

import { PlusSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface CategoryClientProps {
    data: CategoryColumn[]
}

const CategoryClient: React.FC<CategoryClientProps> = ({
    data
}) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between" >
                <Heading
                title={`Categories (${data.length})`}
                description="Manage categories settings" 
                />
                <Button onClick={()=> router.push(`/${params.storeId}/categories/new`)}>
                    <PlusSquare className="mr-2 h-5 w-5"/>
                    Add new
                </Button>
            </div>
            <Separator />
            <DataTable filterKey="name" columns={columns} data={data}/>
            <Heading title="API" description="List of API calls for categories"/>
            <Separator />
            <ApiList entityName="categories" entityIdName="categoryId"/>
        </>
     );
}
 
export default CategoryClient;