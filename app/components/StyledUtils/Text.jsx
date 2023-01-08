import styled from 'styled-components'
import { color, display, fontSize, fontStyle, fontWeight, space, textAlign } from 'styled-system'

export const Span = styled.span`
  ${color}
  ${fontSize}
  ${fontStyle}
  ${fontWeight}
  ${space}
`

export const Small = styled.small`
  ${color}
  ${fontSize}
  ${fontWeight}
  ${space}
  ${display}
`

export const P = styled.p`
  ${color}
  ${fontSize}
  ${fontStyle}
  ${fontWeight}
  ${space}
  ${display}
  ${textAlign}
`
