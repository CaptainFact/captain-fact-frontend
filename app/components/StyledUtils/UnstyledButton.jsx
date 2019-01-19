import styled from 'styled-components'
import { themeGet, fontSize, fontWeight, space, color } from 'styled-system'

/**
 * A button with all browser styles removed.
 */
const UnstyledButton = styled.button`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  cursor: pointer;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  outline-offset: 2px;

  &:hover {
    color: ${themeGet('colors.black.300')};
  }

  &:focus {
    outline: 1px dashed ${themeGet('colors.black.100')};
  }

  ${color}
  ${fontSize}
  ${fontWeight}
  ${space}
`

export default UnstyledButton
