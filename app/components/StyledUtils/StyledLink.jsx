import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { borders, color, display, fontSize, fontWeight, space } from 'styled-system'

const StyledLink = styled(Link)`
  ${color}
  ${fontSize}
  ${fontWeight}
  ${space}
  ${borders}
  ${display}
`

export default StyledLink
