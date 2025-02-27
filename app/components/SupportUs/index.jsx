import React from 'react'

import { JS_ENV } from '../../config'
import { optionsToQueryString } from '../../lib/url_utils'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import { LoadingFrame } from '../Utils/LoadingFrame'

const getIframeURLParams = (isAuthenticated, loggedInUser) => {
  const params = { useTheme: true }
  if (isAuthenticated && loggedInUser) {
    params.defaultEmail = loggedInUser.email
    params.defaultName = loggedInUser.name || loggedInUser.username
  }

  return optionsToQueryString(params)
}

const OPENCOLLECTIVE_DOMAINS = {
  dev: 'https://opencollective.com',
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
    <div className="flex justify-center items-center h-[--main-height] w-full overflow-y-auto">
      {isLoading && <LoadingFrame />}
      <iframe
        ref={iframeRef}
        src={`${ocDomain}/embed/captainfact_io/donate${iframeUrlParams}`}
        style={{ width: '100%', height: '100%', display: isLoading ? 'none' : 'block' }}
        onLoad={() => setLoading(false)}
        title="Support us on Open Collective"
      />
    </div>
  )
}

// ts-unused-exports:disable-next-line
export default SupportUs
