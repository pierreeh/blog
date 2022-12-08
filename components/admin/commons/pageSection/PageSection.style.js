import styled from 'styled-components'

import { rem } from 'styles/ClobalStyles.style'

export const Section = styled.section`
  background-color: rgb(255, 255, 255);
  padding: ${rem(16)};
  position: ${({ isSticky }) => isSticky ? 'sticky' : ''};
  top: ${({ isSticky }) => isSticky ? 0 : ''};
`