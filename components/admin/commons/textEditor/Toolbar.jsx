import { useSlate } from 'slate-react'
import { Divider, Button } from 'antd'
import { AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined, BoldOutlined, ItalicOutlined, UnderlineOutlined, PictureOutlined } from '@ant-design/icons'

import { isBlockActive, isLinkActive, isMarkActive, toggleBlock, toggleMark, insertLink, isUrl } from './editorUtils'

function BlockButton({ format, icon, style }) {
  const editor = useSlate()

  return (
    <Button
      htmlType='button'
      style={style}
      type={isBlockActive(editor, format) ? "primary" : "default"}
      onMouseDown={e => {
        e.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      {icon}
    </Button>
  )
}

function MarkButton({ format, icon }) {
  const editor = useSlate()

  return (
    <Button
      htmlType='button'
      type={isMarkActive(editor, format) ? "primary" : "default"}
      onMouseDown={e => {
        e.preventDefault()
        toggleMark(editor, format)
      }}
    >
      {icon}
    </Button>
  )
}

function LinkButton({ format, icon, style }) {
  const editor = useSlate()

  return (
    <>
      <Button
        htmlType='button'
        style={style}
        type={isLinkActive(editor) ? "primary" : "default"}
        disabled={isLinkActive(editor)}
        onMouseDown={e => {
          e.preventDefault()
          const url = prompt("Enter a URL")
          if (url && !isUrl(url)) {
            alert('Please insert a valid link')
            return
          }
          insertLink(editor, url, format)
        }}
      >
        {icon}
      </Button>
    </>
  )
}

export default function Toolbar() {
  return (
    <header style={{ display: 'flex', alignItems: 'center', backgrounColor: 'white', padding: '.25em 0', position: 'sticky', top: 0 }}>
      <BlockButton format='textLeft' icon={<AlignLeftOutlined />} />
      <BlockButton format='textCenter' icon={<AlignCenterOutlined />} />
      <BlockButton format='textRight' icon={<AlignRightOutlined />} />

      <Divider type='vertical' />
      
      <MarkButton format="bold" icon={<BoldOutlined />} />
      <MarkButton format="italic" icon={<ItalicOutlined />} />
      <MarkButton format="underline" icon={<UnderlineOutlined />} />

      <Divider type='vertical' />

      <BlockButton format='heading-1' icon='h1' />
      <BlockButton format='heading-2' icon='h2' />
      <BlockButton format='heading-3' icon='h3' />

      <Divider type="vertical" />
      
      <BlockButton style={{ display: 'inline-flex', alignItems: 'center' }} format='blockquote' icon={<img src='/images/icons/quote.svg' alt='' height={18} />} />
      <LinkButton style={{ display: 'inline-flex', alignItems: 'center' }} format='link' icon={<img src='/images/icons/link.svg' alt='' height={18} />} />
    </header>
  )
}
