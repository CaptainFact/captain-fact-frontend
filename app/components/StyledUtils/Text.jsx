import styled from 'styled-components'
import {
  color,
  display,
  fontSize,
  fontStyle,
  fontWeight,
  lineHeight,
  space,
  textAlign,
} from 'styled-system'

/** @deprecated */
export const Span = styled.span`
  ${color}
  ${fontSize}
  ${fontStyle}
  ${fontWeight}
  ${space}
`

/** @deprecated */
export const P = styled.p`
  ${color}
  ${fontSize}
  ${fontStyle}
  ${fontWeight}
  ${space}
  ${display}
  ${textAlign}
  ${lineHeight}
`
