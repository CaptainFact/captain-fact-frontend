import React from 'react'
import Container from '../StyledUtils/Container'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import { optionsToQueryString } from '../../lib/url_utils'
import { JS_ENV } from '../../config'

const getIframeURLParams = (isAuthenticated, loggedInUser) => {
  const params = { useTheme: true }
  if (isAuthenticated && loggedInUser) {
    params.defaultEmail = loggedInUser.email
    params.defaultName = loggedInUser.name || loggedInUser.username
  }

  return optionsToQueryString(params)
}

const OPENCOLLECTIVE_DOMAINS = {
  dev: 'http://localhost:3000',
  staging: 'https://staging.opencollective.com',
  prod: 'https://opencollective.com',
}

const SupportUs = () => {
  const [isLoading, setLoading] = React.useState(true)
  const { loggedInUser, isAuthenticated } = useLoggedInUser()
  const iframeRef = React.useRef()
  const ocDomain = OPENCOLLECTIVE_DOMAINS[JS_ENV] || OPENCOLLECTIVE_DOMAINS.prod
  const iframeUrlParams = getIframeURLParams(isAuthenticated, loggedInUser)
  return (
    <Container display="flex" width="100%" height="100%" justifyContent="center">
      {isLoading && <LoadingFrame />}
      <iframe
        ref={iframeRef}
        src={`${ocDomain}/embed/captainfact_io/donate${iframeUrlParams}`}
        style={{ width: '100%', height: '100%', display: isLoading ? 'none' : 'block' }}
        onLoad={() => setLoading(false)}
      />
    </Container>
  )
}

export default SupportUs
