"use client"; // to declare as a cilent component

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

export default function SetupPage() {
  const onOpen = useStoreModal((state) => state.onOpen); //using multipel state slices to declare variable to useState directly => less codes
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(()=> {
    if(!isOpen){
      onOpen();
    }
  }, [isOpen, onOpen])


  return null;
}
