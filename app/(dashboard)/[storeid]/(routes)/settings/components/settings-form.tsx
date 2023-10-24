"use client";

import * as z from "zod";
import { Store } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1)
});

type SettingsFormValues = z.infer<typeof formSchema>

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
    const params = useParams();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const origin = useOrigin();

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const onSubmit = async (data: SettingsFormValues) => {
        try{
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh();
            toast.success("Store is updated.");
        } catch (error){
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push("/"); //route to root page to check on existing stores -> if no store available, prompt user to create store
            toast.success("Store is deleted.");
        } catch (error) {
            toast.error("Please make sure you remove all the categories and products first.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }
 
    return (
        <>
            <AlertModal 
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
            />
            <div className="flex items-center justify-between mb-1">
                <Heading 
                title="Settings"
                description="Change store settings"
                />
                <Button
                disabled={loading}
                variant="destructive"
                size="sm"
                onClick={()=> setOpen(true)}
                >
                    <Trash2 className="h-5 w-5"/>
                </Button>
            </div>
            <Separator />
            <Form {...form}>  {/* take the props from formSchema object*/}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Store name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>  
                        )}
                        />
                    </div>
                    <Button disabled={loading} type="submit" className="">
                        Save changes
                    </Button>
                </form>
            </Form>
            <Separator className="mt-2"/>
            <ApiAlert title="NEXT_API_URL" description={`${origin}/api/${params.storeId}`} variant="public"/> 
        </> 
     );
}
 
export default SettingsForm;