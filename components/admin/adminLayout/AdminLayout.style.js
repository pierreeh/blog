import styled from "styled-components"
import { Layout } from "antd"

import { rem } from "styles/ClobalStyles.style"

const { Content } = Layout

export const StyledLayout = styled(Layout)`
  min-height: 100vh;
`

export const StyledContent = styled(Content)`
  padding: ${rem(16)};
`