import { truncate } from 'lodash'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { Support } from 'styled-icons/boxicons-regular'
import { Github } from 'styled-icons/fa-brands'
import { Redo } from 'styled-icons/fa-solid'

import { optionsToQueryString } from '../../lib/url_utils'
import Container from '../StyledUtils/Container'
import { Button } from '../ui/button'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import Message from '../Utils/Message'

const getGithubIssueURL = (stacktrace) => {
  const navigatorInfo = typeof navigator === 'undefined' ? {} : navigator
  const title = 'Unexpected error when ___________'
  const body = `
# Describe the bug
*A clear description of what the bug is.*

# Device
- OS: ${navigatorInfo.platform}
- Browser: \`${navigatorInfo.appVersion}\`

# Context

:warning: PLEASE REMOVE ANY PERSONAL INFORMATION BELOW :warning:

**URL**: ${typeof window === 'undefined' ? 'Unknown' : window.location}

**Stacktrace**:
\`\`\`
${stacktrace}
\`\`\`
`

  return `https://github.com/CaptainFact/captain-fact/issues/new${optionsToQueryString({
    title,
    body,
  })}`
}

const CrashReportPage = ({ t, error }) => {
  const stackTrace = truncate(error.stack, { length: 6000 })
  // eslint-disable-next-line no-console
  console.error(error)
  return (
    <div className="flex flex-col items-center py-16">
      <div>
        <Message type="danger">{t('crash')}</Message>
      </div>
      <div className="flex gap-2 mt-12">
        <a href="mailto:bug-report@captainfact.io">
          <Button variant="outline" className="is-large">
            <Support size="1em" />
            &nbsp;{t('contactSupport')}
          </Button>
        </a>
        <ExternalLinkNewTab href={getGithubIssueURL(stackTrace)}>
          <Button variant="outline">
            <Github size="0.9em" />
            &nbsp;{t('addIssue')}
          </Button>
        </ExternalLinkNewTab>
        <Button variant="outline" onClick={() => location.reload()}>
          <Redo size="0.7em" />
          &nbsp;{t('reload')}
        </Button>
      </div>
      {stackTrace && (
        <Container mt={5} maxWidth={1200}>
          <details>
            <summary style={{ textAlign: 'center', marginBottom: 12 }}>{t('errorDetails')}</summary>
            <Container p={3}>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{stackTrace}</pre>
            </Container>
          </details>
        </Container>
      )}
    </div>
  )
}

export default withTranslation('errors')(CrashReportPage)
