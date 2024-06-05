"use client";
import React, { memo, useEffect, useRef } from "react";
import EditorJS, { API } from "@editorjs/editorjs";
import { OutputData } from "@editorjs/editorjs";
import EDITOR_CONFIG_TOOLS from "../_config/editorjs.config";

type EditorProps = {
  holder: string;
  data?: OutputData;
  onChange?: (content: object) => void;
};

const Editor: React.FC<EditorProps> = ({ holder, data, onChange }) => {
  const editorRef = useRef<EditorJS>();

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: holder,
        tools: EDITOR_CONFIG_TOOLS,
        data: data,
        onChange: async (api, event) => {
          // console.log("onChange api", api.blocks);
          // console.log("onChange event", event);
          //   const content = await editorRef.current?.save();
          //   if (onChange && content) {
          //     onChange(content);
          //   }
        },
        placeholder: "Type something brilliant here! 😋",
        inlineToolbar: true,
      });
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
  }, []);

  return <div id={holder} />;
};

export default memo(Editor);
