"use client";
import { PartialBlock } from "@blocknote/core";
import { Button } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { SearchIcon } from "../_components/SearchIcon";
import { ImageIcon } from "../_components/ImageIcon";
// const Editor = dynamic(() => import("@/app/_components/BlockNoteEditor"), {
//   ssr: false,
// });

export default function Page() {
  const [content, setContent] = useState<PartialBlock[]>();

  return (
    <>
      {/* <ImageIcon /> */}
      {/* <Editor initialContent={content} onChange={setContent} />
      <pre>{JSON.stringify(content, null, 2)}</pre> */}
      <Button startContent={<ImageIcon />} className="w-auto">
        Upload image
      </Button>
    </>
  );
}
