import styled from "styled-components"

import { rem } from "styles/ClobalStyles.style"

export const EditorModal = styled.div`
  position: sticky;
  top: 4rem;
  z-index: 100;
  padding: ${rem(8)};
  background-color: #fff;
  min-width: 40vw;
  box-shadow: .5rem 0 1rem rgba(0,0,0,.08);
`