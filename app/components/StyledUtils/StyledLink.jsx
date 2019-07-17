import styled from 'styled-components'
import Link from 'next/link'
import { fontSize, fontWeight, space, color, borders, display } from 'styled-system'

const StyledLink = styled(Link)`
  ${color}
  ${fontSize}
  ${fontWeight}
  ${space}
  ${borders}
  ${display}
`

export default StyledLink
