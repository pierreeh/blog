import { useMemo, useCallback } from 'react'
import { createEditor } from 'slate'
import { withReact, Editable, Slate } from 'slate-react'
import { withHistory } from 'slate-history'
import { isHotkey } from 'is-hotkey'

import { RenderElement, RenderLeaf, hotKeys, toggleMark } from './editorUtils'
import Toolbar from './Toolbar'

export default function Editor({ body, onChange, placeholder }) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const renderElement = useCallback(props => <RenderElement {...props} />)
  const renderLeaf = useCallback(props => <RenderLeaf {...props} />)

  const onKeyHandler = useCallback(e => {
    for (const hotKey in hotKeys) {
      if (isHotkey(hotKey, e)) {
        e.preventDefault()
        const mark = hotKeys[hotKey]
        toggleMark(editor, mark)
      }
    }
  }, [])

  console.log(body)

  return (
    <>
      <Slate
        editor={editor}
        value={body}
        onChange={value => onChange(value)}
      >
        <Toolbar />
        <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px', padding: '6px' }}>
          <Editable
            style={{ minHeight: '4rem' }}
            placeholder={placeholder}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={e => onKeyHandler(e)}
          />
        </div>
      </Slate>
    </>
  )
}
