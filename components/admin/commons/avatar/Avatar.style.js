import Image from "next/image"
import styled from "styled-components"

import { rem } from "styles/ClobalStyles.style"

export const Figure = styled.figure`
  position: relative;
  height: ${rem(32)};
  width: ${rem(32)};
  margin: ${({ margins }) => margins || ""};
`

export const AvatarImg = styled(Image)`
  border-radius: 50%;
`