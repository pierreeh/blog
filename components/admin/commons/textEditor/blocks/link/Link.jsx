import { useSlateStatic, useSelected, useFocused } from 'slate-react'
import { Button } from 'antd'

import { removeLink } from 'components/admin/commons/textEditor/editorUtils'

export default function Link({ attributes, element, children }) {
  const editor = useSlateStatic()
  const selected = useSelected()
  const focused = useFocused()
  
  return (
    <>
      <a {...attributes} href={element.url}>
        {children}
      </a>
      {selected && focused && (
        <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', zIndex: 1, background: 'white', padding: '.25rem .5rem', boxShadow: '.25rem .25rem .75rem rgba(0,0,0,.16)', borderRadius: '6px' }} contentEditable={false}>
          <a href={element.url}>
            {element.url}
          </a>
          <Button style={{ marginLeft: '.5rem', display: 'inline-flex', alignItems: 'center' }} htmlType='button' onClick={() => removeLink(editor)}>
            <img src='/images/icons/unlink.svg' alt='' height={18} />
          </Button>
        </div>
      )}
    </>
  )
}
