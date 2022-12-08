import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Row, Col, Button } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'

import Avatar from 'components/admin/commons/avatar/Avatar'
import { DropdownWrapper, StyledDropdown } from './AdminHeader.style'
import { rem } from 'styles/ClobalStyles.style'

const items = [
  {
    key: 1,
    label: <Link href='/users/my-account'><UserOutlined /> My account</Link>
  },
  {
    key: 2,
    label: <Link href='/' onClick={() => signOut({ callbackUrl: '/' })}><LogoutOutlined /> Sign Out</Link>
  }
]

export default function AdminHeader() {
  const { data: session } = useSession()
  
  return (
    <Row>
      <Col span={12}>
        <Link href='/'>Blog</Link>
      </Col>

      {session &&
        <DropdownWrapper span={12}>
          <StyledDropdown menu={{ items }} placement="bottomRight">
              <Button type="link">
                <Avatar 
                  src={session?.user.image}
                  alt="avatar"
                  fill
                  sizes="100%"
                  margins={`0 ${rem(16)} 0 0`}
                />
                {session.user.name}
              </Button>
          </StyledDropdown>
        </DropdownWrapper>
      }
    </Row>
  )
}