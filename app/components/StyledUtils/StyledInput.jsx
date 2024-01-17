import styled from 'styled-components'
import * as styledSystem from 'styled-system'

const StyledInput = styled.input`
  ${styledSystem.space}
  ${styledSystem.borders}
  ${styledSystem.borderColor}
  ${styledSystem.borderRadius}
  ${styledSystem.color}
  ${styledSystem.display}
  ${styledSystem.flex}
  ${styledSystem.fontSize}
  ${styledSystem.height}
  ${styledSystem.justifyContent}
  ${styledSystem.maxHeight}
  ${styledSystem.maxWidth}
  ${styledSystem.minHeight}
  ${styledSystem.minWidth}
  ${styledSystem.width}
`

StyledInput.defaultProps = {
  // Wee still rely on bulma styles
  className: 'input',
}

export default StyledInput
