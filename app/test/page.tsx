"use client";
import { useDisclosure, Button } from "@nextui-org/react";
import RecipeInputModal from "@/_components/RecipeInputModal";

export default function Page() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Open</Button>
      <RecipeInputModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
