import { Editor, Transforms, Text, Range, Element } from 'slate'
import { ReactEditor } from 'slate-react'
import escapeHtml from 'escape-html'

import Link from './blocks/link/Link'
import Images from './blocks/images/Images'

export const hotKeys = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline'
}

export function toHtml(node) {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text)

    if (node.bold) string = `<strong style="font-weight: bolder;">${string}</strong>`
    if (node.italic) string = `<em style="font-style: italic;">${string}</em>`
    if (node.underline) string = `<u style="text-decoration: underline;">${string}</u>`

    return string
  }

  if (Array.isArray(node)) {
    return node.map(n => toHtml(n)).join('')
  }

  const children = node.children ? node.children.map(n => toHtml(n)).join('') : ''

  switch (node.type) {
    case 'heading-1':
      return `<h1>${children}</h1>`
    case 'heading-2':
      return `<h2>${children}</h2>`
    case 'heading-3':
      return `<h3>${children}</h3>`
    case 'paragraph':
      return `<p>${children}</p>`
    case 'textLeft':
      return `<p style="text-align:left">${children}</p>`
    case 'textCenter':
      return `<p style="text-align:center">${children}</p>`
    case 'textRight':
      return `<p style="text-align:right">${children}</p>`
    case 'blockquote':
      return `<blockquote>${children}</blockquote>`
    case 'link':
      if (!children.length) return
      return `<a href="${escapeHtml(node.url)}">${children}</a>`
    default:
      return `<p>${children}</p>`
  }
}

export function RenderElement(props) {
  const { attributes={}, children, element } = props

  switch(element.type) {
    case 'heading-1':
      return <h1 {...attributes} style={{ fontSize: '32px', fontWeight: 'bolder' }}>{children}</h1>
    case 'heading-2':
      return <h2 {...attributes} style={{ fontSize: '28px', fontWeight: 'bolder' }}>{children}</h2>
    case 'heading-3':
      return <h3 {...attributes} style={{ fontSize: '24px', fontWeight: 'bolder' }}>{children}</h3>
    case 'paragraph':
      return <p {...attributes}>{children}</p>
    case 'textLeft':
      return <p {...attributes} style={{ textAlign: 'left' }}>{children}</p>
    case 'textCenter':
      return <p {...attributes} style={{ textAlign: 'center' }}>{children}</p>
    case 'textRight':
      return <p {...attributes} style={{ textAlign: 'right' }}>{children}</p>
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'link':
      return <Link {...props} />
    case 'image':
      return <Images {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

export function RenderLeaf({ attributes={}, children, leaf }) {
  if (leaf.bold) children = <strong style={{ fontWeight: 'bolder' }}>{children}</strong>
  if (leaf.italic) children = <em style={{ fontStyle: 'italic' }}>{children}</em>
  if (leaf.underline) children = <u style={{ textDecoration: 'underline' }}>{children}</u>

  return <span {...attributes}>{children}</span>
}

export function isBlockActive(editor, format) {
  const [match] = Editor.nodes(editor, { match: n => n.type === format })
  return !!match
}

export function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format)
  Transforms.setNodes(editor, { type: isActive ? 'paragraph' : format })
}

export function isMarkActive(editor, format) {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export function toggleMark(editor, format) {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export function isLinkActive(editor) {
  const { selection } = editor
  if (selection == null) return false
  const [match] = Editor.nodes(editor, { match: n => n.type === 'link' })

  if (match) {
    return (
      Editor.above(editor, {
        at: selection,
        match: n => n.type === 'link'
      })
    )
  }
}

function createLinkNode(url, text) {
  return {
    type: 'link',
    url,
    children: [{ text }]
  }
}

export function removeLink(editor, opts = {}) {
  Transforms.unwrapNodes(editor, {
    ...opts,
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link'
  })
}

export function insertLink(editor, url, format) {
  if (!url) return
  const { selection } = editor
  const link = createLinkNode(url, 'New Link')

  ReactEditor.focus(editor)

  if (!!selection) {
    editor.isInline = e => format.includes(e.type)
    const [parentNode, parentPath] = Editor.parent(editor, selection.focus?.path)
    if (parentNode.type === 'link') removeLink(editor)

    if (editor.isVoid(parentNode)) {
      Transforms.insertNodes(editor, createParagraphNode([link]), {
        at: Path.next(parentPath),
        select: true
      })
    } else if (Range.isCollapsed(selection)) {
      Transforms.insertNodes(editor, link, { select: true })
    } else {
      Transforms.wrapNodes(editor, link, { split: true })
      Transforms.collapse(editor, { edge: "end" })
    }
  } else {
    Transforms.insertNodes(editor, createParagraphNode([link]))
  }
}

export function isUrl(string) {
  try {
   let url = new URL(string)
   return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (_) {
    return false
  }
}
