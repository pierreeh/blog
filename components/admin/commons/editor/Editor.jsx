import { useCallback, useMemo } from "react"
import { createEditor } from "slate"
import { withReact, Editable, Slate } from "slate-react"

import useEditorConfig, { useSelection, isLink } from "./EditorConfig"
import EditorLink from "./EditorLink"
import Toolbar from "./Toolbar"

export default function Editor({ body, onChange }) {
  const editor = useMemo(() => withReact(createEditor()), [])
  const { renderElement, renderLeaf, onKeyDown } = useEditorConfig(editor)
  const [selection, setSelection] = useSelection(editor)

  const onChangeHandler = useCallback(body => {
    onChange(body)
    setSelection(editor.selection)
  }, [editor.selection, onChange, setSelection])
  
  return (
    <Slate
      editor={editor}
      value={body}
      onChange={onChangeHandler}
    >
      <Toolbar selection={selection} />
      <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px', padding: '6px' }}>
        {isLink(editor, selection) && <EditorLink />}
        <Editable 
          style={{ minHeight: '4rem' }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
        />
      </div>
    </Slate>
  )
}