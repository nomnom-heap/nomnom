import { ToolConstructable, ToolSettings } from "@editorjs/editorjs";

// @ts-ignore
import Header from "@editorjs/header";

// @ts-ignore
import ImageTool from "@editorjs/image";

// @ts-ignore
import Checklist from "@editorjs/checklist";

// @ts-ignore
import List from "@editorjs/list";

type EditorConfigTools = {
  [toolName: string]: ToolConstructable | ToolSettings;
};

const EDITOR_CONFIG_TOOLS: EditorConfigTools = {
  header: {
    // @ts-ignore
    class: Header,
    config: {
      placeholder: "Enter header",
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 2,
    },
    shortcut: "CMD+SHIFT+H",
    inlineToolbar: true,
  },
  image: {
    class: ImageTool,
    config: {
      // TODO: Add uploader logic https://github.com/editor-js/image
    },
    inlineToolbar: true,
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
};

export default EDITOR_CONFIG_TOOLS;
