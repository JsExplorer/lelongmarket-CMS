"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Store } from "@prisma/client"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusSquare, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];   // array of stores in prismadb
};

export default function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    
    // only require the name and id from the database entries
    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const currentStore = formattedItems.find((item) => item.value === params.storeId);
    // console.log(params.storeId) // initial error due to wrong app routing -> folder name = [storeid]

    const selectedStore = (store: {value: string, label: string}) => {
        setOpen(false);
        router.push(`/${store.value}`);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button 
                variant="outline" 
                size="sm" 
                role="combobox" 
                aria-expanded={open} 
                aria-label="Select a store" 
                className={cn("w-[210px] justify-between", className)}
                >
                    <StoreIcon className="mr-2"/>
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto w-5 h-5 shrink-0 opacity-60"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[210px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search stores here.."></CommandInput>
                        <CommandEmpty>No such store found..</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {formattedItems.map((store)=> (
                                <CommandItem
                                key = {store.value}
                                onSelect={()=> selectedStore(store)}
                                className="text-sm"
                                >
                                
                                <StoreIcon className="mr-2"/>
                                {store.label}
                                <Check className={cn("ml-auto", currentStore?.value === store.value ? "opacity-100" : "opacity-0")}>
                                </Check>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                        <CommandList>
                            <CommandGroup>
                                <CommandItem onSelect={()=> { setOpen(false); storeModal.onOpen(); }}>
                                    <PlusSquare className="mr-2"/>
                                        Create New Store
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
};