import styled from 'styled-components'
import tag from 'clean-tag'
import * as styledSystem from 'styled-system'

const Container = styled(tag)`
  ${styledSystem.alignItems}
  ${styledSystem.alignSelf}
  ${styledSystem.background}
  ${styledSystem.backgroundImage}
  ${styledSystem.backgroundPosition}
  ${styledSystem.backgroundRepeat}
  ${styledSystem.backgroundSize}
  ${styledSystem.borders}
  ${styledSystem.borderColor}
  ${styledSystem.borderRadius}
  ${styledSystem.bottom}
  ${styledSystem.boxShadow}
  ${styledSystem.color}
  ${styledSystem.display}
  ${styledSystem.flex}
  ${styledSystem.flexDirection}
  ${styledSystem.flexWrap}
  ${styledSystem.fontSize}
  ${styledSystem.height}
  ${styledSystem.justifyContent}
  ${styledSystem.left}
  ${styledSystem.maxHeight}
  ${styledSystem.maxWidth}
  ${styledSystem.minHeight}
  ${styledSystem.minWidth}
  ${styledSystem.order}
  ${styledSystem.position}
  ${styledSystem.right}
  ${styledSystem.size}
  ${styledSystem.space}
  ${styledSystem.top}
  ${styledSystem.textAlign}
  ${styledSystem.width}
  ${styledSystem.zIndex}
`

export default Container
