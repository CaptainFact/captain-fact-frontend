import styled from 'styled-components'
import { fontSize, fontWeight, space, style, themeGet } from 'styled-system'

/** @deprecated */
const textTransform = style({
  prop: 'textTransform',
})

/** @deprecated */
export const StyledH2 = styled.h2`
  font-size: ${themeGet('fontSizes.1')};
  margin-bottom: ${themeGet('space.4')};
  ${fontSize}
  ${space}
  ${textTransform}
  ${fontWeight}
`

/** @deprecated */
export const StyledH3 = styled.h3`
  font-size: ${themeGet('fontSizes.2')};
  margin-bottom: ${themeGet('space.3')};
  ${fontSize}
  ${space}
  ${textTransform}
  ${fontWeight}
`
