"use client";
import { PartialBlock } from "@blocknote/core";
import dynamic from "next/dynamic";
import { useState } from "react";
const Editor = dynamic(() => import("@/app/_components/BlockNoteEditor"), {
  ssr: false,
});

export default function Page() {
  const [content, setContent] = useState<PartialBlock[]>();

  return (
    <>
      <Editor initialContent={content} onChange={setContent} />
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </>
  );
}
