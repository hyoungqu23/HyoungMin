"use client";

import { useCallback, useRef, useEffect } from "react";
import Editor, {
  type OnMount,
  type Monaco,
  type EditorProps,
} from "@monaco-editor/react";

type IStandaloneCodeEditor = Parameters<OnMount>[0];

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageInsert?: (imagePath: string, localPath: string) => void;
}

export function MarkdownEditor({
  value,
  onChange,
  onImageInsert,
}: MarkdownEditorProps) {
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure MDX/Markdown language
    monaco.languages.register({ id: "mdx" });
    monaco.languages.setMonarchTokensProvider("mdx", {
      tokenizer: {
        root: [
          [/^---$/, "meta.separator"],
          [/^#+\s.*$/, "keyword"],
          [/\*\*[^*]+\*\*/, "strong"],
          [/\*[^*]+\*/, "emphasis"],
          [/`[^`]+`/, "string"],
          [/```[\s\S]*?```/, "string"],
          [/\[([^\]]+)\]\(([^)]+)\)/, "string.link"],
          [/!\[([^\]]*)\]\(([^)]+)\)/, "string.image"],
          [/<[^>]+>/, "tag"],
        ],
      },
    });

    // Set editor theme
    monaco.editor.defineTheme("editor-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "569cd6", fontStyle: "bold" },
        { token: "strong", foreground: "dcdcaa", fontStyle: "bold" },
        { token: "emphasis", foreground: "dcdcaa", fontStyle: "italic" },
        { token: "string", foreground: "ce9178" },
        { token: "string.link", foreground: "4ec9b0" },
        { token: "string.image", foreground: "4ec9b0" },
        { token: "tag", foreground: "808080" },
        { token: "meta.separator", foreground: "6a9955" },
      ],
      colors: {
        "editor.background": "#1a1a1a",
        "editor.foreground": "#d4d4d4",
        "editor.lineHighlightBackground": "#2a2a2a",
        "editor.selectionBackground": "#264f78",
        "editorCursor.foreground": "#3b82f6",
        "editorLineNumber.foreground": "#6b7280",
        "editorLineNumber.activeForeground": "#d4d4d4",
      },
    });

    monaco.editor.setTheme("editor-dark");

    // Focus editor
    editor.focus();
  }, []);

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      onChange(newValue || "");
    },
    [onChange],
  );

  // Handle image drop
  useEffect(() => {
    const editorElement = editorRef.current?.getDomNode();
    if (!editorElement) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer?.files;
      if (!files?.length) return;

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;

        try {
          // In Tauri context, we'll process the image
          const { invoke } = await import("@tauri-apps/api/core");

          // Read file as array buffer
          const buffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(buffer);

          // Process image through Tauri
          const result = await invoke<{ path: string; localPath: string }>(
            "process_image",
            {
              fileName: file.name,
              data: Array.from(uint8Array),
            },
          );

          // Insert markdown image syntax
          const editor = editorRef.current;
          if (editor) {
            const position = editor.getPosition();
            if (position) {
              const imageMarkdown = `![${file.name.replace(/\.[^/.]+$/, "")}](${result.path})\n`;
              editor.executeEdits("insert-image", [
                {
                  range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                  },
                  text: imageMarkdown,
                },
              ]);
            }
          }

          onImageInsert?.(result.path, result.localPath);
        } catch (error) {
          console.error("Image processing error:", error);
          // Fallback: insert with local file path
          const localPath = URL.createObjectURL(file);
          const editor = editorRef.current;
          if (editor) {
            const position = editor.getPosition();
            if (position) {
              const imageMarkdown = `![${file.name}](${localPath})\n`;
              editor.executeEdits("insert-image", [
                {
                  range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                  },
                  text: imageMarkdown,
                },
              ]);
            }
          }
        }
      }
    };

    editorElement.addEventListener("dragover", handleDragOver);
    editorElement.addEventListener("drop", handleDrop);

    return () => {
      editorElement.removeEventListener("dragover", handleDragOver);
      editorElement.removeEventListener("drop", handleDrop);
    };
  }, [onImageInsert]);

  // Keyboard shortcuts
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    // Cmd/Ctrl + B for bold
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
      const selection = editor.getSelection();
      if (selection) {
        const selectedText =
          editor.getModel()?.getValueInRange(selection) || "";
        editor.executeEdits("bold", [
          {
            range: selection,
            text: `**${selectedText}**`,
          },
        ]);
      }
    });

    // Cmd/Ctrl + I for italic
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI, () => {
      const selection = editor.getSelection();
      if (selection) {
        const selectedText =
          editor.getModel()?.getValueInRange(selection) || "";
        editor.executeEdits("italic", [
          {
            range: selection,
            text: `*${selectedText}*`,
          },
        ]);
      }
    });

    // Cmd/Ctrl + K for link
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      const selection = editor.getSelection();
      if (selection) {
        const selectedText =
          editor.getModel()?.getValueInRange(selection) || "";
        editor.executeEdits("link", [
          {
            range: selection,
            text: `[${selectedText}](url)`,
          },
        ]);
      }
    });
  }, []);

  return (
    <div className="h-full monaco-editor-container">
      <Editor
        height="100%"
        language="mdx"
        value={value}
        onChange={handleChange}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          fontFamily: "var(--font-mono)",
          lineHeight: 1.6,
          padding: { top: 16, bottom: 16 },
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          wrappingIndent: "same",
          lineNumbers: "on",
          renderLineHighlight: "line",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          tabSize: 2,
          automaticLayout: true,
          folding: true,
          foldingStrategy: "indentation",
          links: true,
          contextmenu: true,
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
        }}
        loading={
          <div className="flex items-center justify-center h-full text-muted">
            에디터 로딩 중...
          </div>
        }
      />
    </div>
  );
}
