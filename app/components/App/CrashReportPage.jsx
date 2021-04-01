import React from 'react'
import { Flex } from '@rebass/grid'
import { truncate } from 'lodash'

import { Support } from 'styled-icons/boxicons-regular'
import { Github } from 'styled-icons/fa-brands'
import { Redo } from 'styled-icons/fa-solid'

import { withNamespaces } from 'react-i18next'
import Message from '../Utils/Message'
import Button from '../Utils/Button'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { optionsToQueryString } from '../../lib/url_utils'
import Container from '../StyledUtils/Container'

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

  return (
    <Flex px={2} py={6} flexDirection="column" alignItems="center">
      <Message type="warning">{t('crash')}</Message>
      <br />
      <Flex mt={5} flexWrap="wrap" alignItems="center" justifyContent="center">
        <Button as="a" href="mailto:bug-report@captainfact.io" m={2} className="is-large">
          <Support size="1em" />
          &nbsp;{t('contactSupport')}
        </Button>
        <Button
          m={2}
          className="is-large"
          as={ExternalLinkNewTab}
          href={getGithubIssueURL(stackTrace)}
        >
          <Github size="0.9em" />
          &nbsp;{t('addIssue')}
        </Button>
        <Button m={2} className="is-large" onClick={() => location.reload()}>
          <Redo size="0.7em" />
          &nbsp;{t('reload')}
        </Button>
      </Flex>
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
    </Flex>
  )
}

export default withNamespaces('errors')(CrashReportPage)
