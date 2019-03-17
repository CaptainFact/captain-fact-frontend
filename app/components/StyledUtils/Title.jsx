import styled from 'styled-components'
import { fontSize, space, themeGet, style } from 'styled-system'

export const textTransform = style({
  prop: 'textTransform'
})

export const StyledH1 = styled.h1`
  font-size: ${themeGet('fontSizes.0')};
  margin-bottom: ${themeGet('space.4')};
  ${fontSize}
  ${space}
  ${textTransform}
`

export const StyledH2 = styled.h2`
  font-size: ${themeGet('fontSizes.1')};
  margin-bottom: ${themeGet('space.4')};
  ${fontSize}
  ${space}
  ${textTransform}
`

export const StyledH3 = styled.h3`
  font-size: ${themeGet('fontSizes.2')};
  margin-bottom: ${themeGet('space.3')};
  ${fontSize}
  ${space}
  ${textTransform}
`

export const StyledH4 = styled.h4`
  font-size: ${themeGet('fontSizes.3')};
  margin-bottom: ${themeGet('space.2')};
  ${fontSize}
  ${space}
  ${textTransform}
`

export const StyledH5 = styled.h5`
  font-size: ${themeGet('fontSizes.4')};
  margin-bottom: ${themeGet('space.2')};
  ${fontSize}
  ${space}
  ${textTransform}
`

export const StyledH6 = styled.h6`
  font-size: ${themeGet('fontSizes.5')};
  margin-bottom: ${themeGet('space.1')};
  ${fontSize}
  ${space}
  ${textTransform}
`
