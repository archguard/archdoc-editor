import React, { useCallback, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
// eslint-disable-next-line import/no-unresolved
import { IKeyboardEvent } from "monaco-editor";

interface BlockEditorProps {
  code: string;
  language: string;
  evalCode: any;
  onChange: any;
  removeSelf: any;
}

function CellEditor(props: BlockEditorProps) {
  const editorRef = useRef(null);
  const [height, setHeight] = useState("100%");
  const [code, setCode] = useState(props.code);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  function adjustHeight(editor: monaco.editor.IStandaloneCodeEditor) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const lineCount = editor.getModel()?.getLineCount() || 1;
    const editorHeight = editor.getTopForLineNumber(lineCount + 1) + lineHeight;

    setHeight(editorHeight + "px");
    editor.layout({
      width: editor.getLayoutInfo().width,
      height: editorHeight,
    });
  }

  function initEditor(editor) {
    editor.focus();
    editor.onKeyDown((e: IKeyboardEvent) => {
      if (e.code === "Backspace") {
        if (editor.getValue() === "") {
          props.removeSelf();
        }
      }
    });
  }

  const handleEditorDidMount = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (editor: Editor) => {
      editorRef.current = editor;
      if (!!editorRef.current) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        adjustHeight(editorRef.current);
        initEditor(editor);
      }
    },
    [editorRef, setHeight, code]
  );

  const changeCode = useCallback(
    code => {
      if (!!editorRef.current) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        adjustHeight(editorRef.current);
        setCode(code);
        props.onChange(code);
      }
    },
    [editorRef, setCode]
  );

  useCallback(() => {
    props.evalCode(code);
  }, [code]);

  return (
    <div>
      <Editor
        height={height}
        defaultLanguage={props.language}
        value={code}
        onChange={changeCode}
        onMount={handleEditorDidMount}
        options={{ scrollBeyondLastLine: false, automaticLayout: true }}
      />
    </div>
  );
}

export default CellEditor;
