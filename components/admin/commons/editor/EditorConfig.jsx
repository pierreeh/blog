import { useCallback, useState } from "react"
import { Editor, Range, Transforms, Element, Text } from "slate"
import { DefaultElement } from "slate-react"
import { Typography } from "antd"
import areEqual from 'deep-equal'
import isHotkey from 'is-hotkey'

const KeyBindings = {
  onKeyDown: (editor, e) => {
    if (isHotkey("mod+b", e)) {
      toggleStyles(editor, "bold")
      return
    }
    if (isHotkey("mod+i", e)) {
      toggleStyles(editor, 'italic')
      return
    }
  }
}

export default function useEditorConfig(editor) {
  const onKeyDown = useCallback(e => KeyBindings.onKeyDown(editor, e), [editor])
  editor.isInline = element => ['link'].includes(element.type)

  return { renderElement, renderLeaf, onKeyDown }
}

export function useSelection(editor) {
  const [selection, setSelection] = useState(editor.selection)

  const setSelectionOptimized = useCallback(newSelection => {
    if (areEqual(selection, newSelection)) {
      return
    }
    setSelection(newSelection)
  }, [setSelection, selection])

  return [selection, setSelectionOptimized]
}

export function getActiveStyles(editor) {
  return new Set(Object.keys(Editor.marks(editor) ?? {}))
}

export function toggleStyles(editor, style) {
  const activeStyles = getActiveStyles(editor)
  if (activeStyles.has(style)) {
    Editor.removeMark(editor, style)
  } else {
    Editor.addMark(editor, style, true)
  }
}

export function getTextBlockStyles(editor) {
  const selection = editor.selection
  if (selection == null) {
    return null
  }

  const [start, end] = Range.edges(selection)
  let startTopLevelBlockIndex = start.path[0]
  const endTopLevelBlockIndex = end.path[0]
  let blockType = null

  while (startTopLevelBlockIndex <= endTopLevelBlockIndex) {
    const [node, _] = Editor.node(editor, [startTopLevelBlockIndex])
    if (blockType == null) {
      blockType = node.type
    } else if (blockType !== node.type) {
      return "multiple"
    }
    startTopLevelBlockIndex++
  }

  return blockType
}

export function toggleBlockType(editor, blockType) {
  const currentBlockType = getTextBlockStyles(editor)
  const changeTo = currentBlockType === blockType ? "p" : blockType

  Transforms.setNodes(editor,
    { type: changeTo },
    { at: editor.selection, match: n => Editor.isBlock(editor, n) }  
  )
}

export function isLink(editor, selection) {
  if (selection == null) {
    return false
  }

  return Editor.above(editor, {
    at: selection,
    match: n => n.type === "link"
  }) != null
}

export function toggleLink(editor) {
  if (!isLink(editor, editor.selection)) {
    const isSelectionCollapsed = Range.isCollapsed(editor.selection)

    if (isSelectionCollapsed) {
      Transforms.insertNodes(
        editor,
        { type: 'link', href: "", children: [{ text: "link" }] },
        { at: editor.selection }
      )
    } else {
      Transforms.wrapNodes(
        editor,
        { type: 'link', href: "", children: [{ text: "link" }] },
        { split: true, at: editor.selection }
      )
    }
  } else {
    Transforms.unwrapNodes(
      editor,
      { match: n => Element.isElement(n) && n.type === "link" }
    )
  }
}

function isUrl(string) {
  try {
   let url = new URL(string)
   return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (_) {
    return false
  }
}

function renderElement(props) {
  const { element, children, attributes } = props

  switch (element.type) {
    case "p":
      return <Typography.Text {...attributes}>{children}</Typography.Text>
    case "h1":
      return <Typography.Title level={1} {...attributes}>{children}</Typography.Title>
    case "h2":
      return <Typography.Title level={2} {...attributes}>{children}</Typography.Title>
    case "h3":
      return <Typography.Title level={3} {...attributes}>{children}</Typography.Title>
    case "link":
      return <a {...attributes} href={element.url}>{children}</a>
    default:
      return <DefaultElement {...props} />
  }
}

function renderLeaf({ attributes={}, leaf, children }) {
  if (leaf.bold) children = <Typography.Text strong>{children}</Typography.Text>
  if (leaf.italic) children = <Typography.Text style={{ fontStyle: 'italic' }}>{children}</Typography.Text>

  return <span {...attributes}>{children}</span>
}