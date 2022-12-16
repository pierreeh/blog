import { useCallback } from 'react'
import { Button, Divider } from 'antd'
import { useSlate } from 'slate-react'
import { LinkOutlined } from '@ant-design/icons'

import { getActiveStyles, getTextBlockStyles, toggleBlockType, toggleStyles, isLink, toggleLink } from './EditorConfig'

const paragraphStyles = ["p", "h1", "h2", "h3"]
const characterStyles = ["bold", "italic"]

export default function Toolbar({ selection }) {
  const editor = useSlate()

  const onBlockTypeChange = useCallback(type => {
    if (type === "multiple") {
      return
    }
    toggleBlockType(editor, type)
  }, [editor])
  const blockType = getTextBlockStyles(editor)
  
  return (
    <header style={{ marginBottom: '.5rem', position: 'sticky', top: 0, backgroundColor: '#fff', padding: '.5rem', zIndex: 100, boxShadow: ".5rem 0 1rem rgba(0,0,0,.08" }}>
      {paragraphStyles.map(p => (
        <Button 
          type={blockType === p ? "primary" : "default"}
          key={p}
          htmlType='button'
          onMouseDown={() => onBlockTypeChange(p)}
        >
          {p}
        </Button>
      ))}
      <Divider type='vertical' />
      {characterStyles.map(c => (
        <Button 
          type={getActiveStyles(editor).has(c) ? "primary" : "default"}
          key={c}
          htmlType='button'
          onMouseDown={() => toggleStyles(editor, c)}
        >
          {c.slice(0, 1).toLocaleUpperCase()}
        </Button>
      ))}
      <Divider type='vertical' />
      <Button
        htmlType='button'
        type={isLink(editor, editor.selection) ? "primary": "default"}
        onMouseDown={() => toggleLink(editor)}
      >
        <LinkOutlined />
      </Button>
    </header>
  )
}