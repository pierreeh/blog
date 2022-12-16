import { useRef, useCallback } from 'react'
import { Editor, Transforms } from 'slate'
import { useSlate } from 'slate-react'
import { Input } from 'antd'

import { EditorModal } from './EditorLink.style'

export default function LinkEditor() {
  const editor = useSlate()
  const linkEditorRef = useRef()
  const [linkNode, path] = Editor.above(editor, {match: n => n.type === 'link'})

  const onUrlChange = useCallback(e => {
    const value = e.target.value;
    return Transforms.setNodes(editor, { href: value }, { at: path });
  }, [editor, path])

  return (
    <EditorModal ref={linkEditorRef}>
      <Input type="text" value={linkNode.href} onChange={onUrlChange} placeholder='Insert url' />
    </EditorModal>
  )
}