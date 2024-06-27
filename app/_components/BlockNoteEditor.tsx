"use client";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo, useState } from "react";
import { uploadData, getUrl } from "aws-amplify/storage";
import { Spinner } from "@nextui-org/spinner";

async function uploadFileToPublicFolder(file: File): Promise<string> {
  const res = await uploadData({
    path: `public/${file.name}_${Date.now()}`,
    data: file,
  }).result;

  const { url } = await getUrl({
    path: res.path,
  });

  return `${url.origin}${url.pathname}`;
}

type EditorProps = {
  initialContent?: PartialBlock[];
  domAttributes?: Record<string, string>;
  defaultStyles?: boolean;
  uploadFile?: (file: File) => Promise<string>;
  onChange?: (document: Block[]) => void;
  editable?: boolean;
  trailingBlock?: boolean;
  className?: string;
};

export default function Editor({
  initialContent,
  uploadFile,
  onChange,
  editable,
  className,
}: EditorProps) {
  const [content, setContent] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");
  useEffect(() => {
    setContent(initialContent);
  }, []);

  // Creates a new editor instance.
  // We use useMemo + createBlockNoteEditor instead of useCreateBlockNote so we
  // can delay the creation of the editor until the initial content is loaded.
  const editor = useMemo(() => {
    if (content === "loading") {
      return undefined;
    }

    return BlockNoteEditor.create({
      initialContent: content,
      uploadFile: uploadFile ?? uploadFileToPublicFolder,
    });
  }, [content]);

  if (editor === undefined) {
    return <Spinner color="default" />;
  }

  return (
    <BlockNoteView
      editor={editor}
      className={className}
      onChange={() => {
        if (onChange) {
          onChange(editor.document);
        }
      }}
      editable={editable}
    />
  );
}
