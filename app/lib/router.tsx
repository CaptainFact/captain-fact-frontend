import { withRouter } from 'react-router'

const WithRouterBase = ({ children, ...router }) => {
  return children({ router })
}

export const WithRouterForRenderProp = withRouter(WithRouterBase)
