import React, { useCallback, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

interface BlockEditorProps {
  code: string;
  language: string;
  evalCode: any;
}

function CellEditor(props: BlockEditorProps) {
  const editorRef = useRef(null);
  const [height, setHeight] = useState("100%");
  const [code, setCode] = useState(props.code);

  function adjustHeight(editor: monaco.editor.IStandaloneCodeEditor) {
    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const lineCount = editor.getModel()?.getLineCount() || 1;
    const editorHeight = editor.getTopForLineNumber(lineCount + 1) + lineHeight;

    setHeight(editorHeight + "px");
    editor.layout({
      width: editor.getLayoutInfo().width,
      height: editorHeight,
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
      }
    },
    [setCode]
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
