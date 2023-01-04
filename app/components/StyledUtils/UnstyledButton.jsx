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

  &:hover:not(:disabled) {
    color: ${themeGet('colors.primary')};
  }

  &:focus {
    outline: 1px solid ${themeGet('colors.primary')};
    outline-offset: 0px;
    box-shadow: 0 0 5px 1px #6ba3a7;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${color}
  ${fontSize}
  ${fontWeight}
  ${space}
`

export default UnstyledButton
