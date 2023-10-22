"use client";

import axios from 'axios';
import { useState } from 'react';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-hot-toast';

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({  //using zod validation for objects with a "name" field and ensuring it's non-empty string (min 1 char)
    name: z.string().min(1),
})

export const StoreModal = () => {
    const storeModal = useStoreModal();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/stores', values);
            toast.success("Store created.");
            window.location.assign(`/${response.data.id}`) //refresh the page and making sure the data is loaded into database

        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false);
        }
    }


    return (
    <Modal
     title ="Create store"
     description="Add a new store to manage products and categories"
     isOpen={storeModal.isOpen}
     onClose={storeModal.onClose}
    >
        <div>
            <div className="space-y-5 py-3 pb-5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={
                                ({field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl> 
                                            <Input disabled={loading} placeholder="Store name" {...field}/> 
                                            {/* render all the field props instead of typing "onChange, onBlur, and etc*/}
                                        </FormControl>
                                        <FormMessage> {/* display message that doesn't not meet the condition */}
                                        </FormMessage>
                                    </FormItem>
                                )
                            }
                        />
                        <div className="pt-5 space-x-3 flex items-center justify-end">
                            <Button variant="outline" onClick={storeModal.onClose} disabled={loading}>Cancel</Button>
                            <Button type="submit" disabled={loading}>Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </Modal>
    )
}