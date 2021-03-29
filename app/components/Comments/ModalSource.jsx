import React from 'react'
import { withRouter } from 'react-router'
import { withNamespaces, Trans } from 'react-i18next'
import GraphQLClient from '../../API/graphql_api'
import { isIframeAllowed } from '../../API/graphql_queries'
import Modal from '../Modal/Modal'

import { LoadingFrame } from '../Utils/LoadingFrame'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

import styled from 'styled-components'
import { Flex, Box } from '@rebass/grid'
import { TimesCircle } from 'styled-icons/fa-solid'
import { LinkExternal } from 'styled-icons/octicons'

const CloseButton = styled(({ size = '1em', ...props }) => (
  <TimesCircle size={size} cursor="pointer" {...props} />
))`
  color: black;
  &:hover {
    opacity: 0.75;
  }
`

const UrlBarHeader = styled(Flex)`
  border-bottom: 1px solid #dbdbdb;
  background-color: white;
  padding: 10px;
  position: relative;
`
const StyledExternalLinkNewTab = styled(ExternalLinkNewTab)`
  color: black;
`

const UrlBarTitle = styled(Box)`
  display: inline-block;
  vertical-align: middle;
  width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const IframeContainer = styled(Flex)`
  background-color: white;
  height: 100%;
`

const ErrorMessage = styled.p`
  width: 70%;
  text-align: center;
`

@withNamespaces('videoDebate')
@withRouter
class ModalSource extends React.PureComponent {
  state = { isIframeAllowed: false, isLoading: true }

  renderUrlBarHeader = (url, title, website_name) => {
    const { t, router } = this.props
    const titleToDisplay = title === null ? website_name : title

    return (
      <UrlBarHeader justifyContent="space-between">
        <Box>
          <StyledExternalLinkNewTab href={url} title={titleToDisplay}>
            <LinkExternal size="1em" />
            <UrlBarTitle ml="0.2em">{titleToDisplay}</UrlBarTitle>
          </StyledExternalLinkNewTab>
        </Box>
        <CloseButton size="1.5em" title={t('modalSource.close')} onClick={router.goBack} />
      </UrlBarHeader>
    )
  }

  render() {
    const { isIframeAllowed, isLoading } = this.state
    const { source, router, ...otherProps } = this.props
    const { url, title, website_name } = source

    return (
      <Modal
        customHeader={this.renderUrlBarHeader(url, title, website_name)}
        overrideContentStructure
        isModalSource
        handleCloseClick={router.goBack}
        {...otherProps}
      >
        <IframeContainer justifyContent="center" alignItems="center">
          {isLoading && <LoadingFrame />}
          {!isLoading && !isIframeAllowed && (
            <ErrorMessage>
              <Trans i18nKey="modalSource.errorMessage">
                This source is not available to preview, click here on the link above
                <LinkExternal size="1em" /> to open it in a new tab.
              </Trans>
            </ErrorMessage>
          )}
          {isIframeAllowed && (
            <iframe
              sandbox=""
              src={url}
              style={{
                width: '100%',
                height: '100%',
                display: isLoading ? 'none' : 'block',
              }}
              onLoad={() => this.setState({ isLoading: false })}
            />
          )}
        </IframeContainer>
      </Modal>
    )
  }

  componentDidMount() {
    window.location.assign('#source')
    GraphQLClient.query({
      query: isIframeAllowed,
      variables: { url: this.props.source.url },
    }).then((result) =>
      result.data.isIframeAllowed
        ? this.setState({ isIframeAllowed: true })
        : this.setState({ isLoading: false })
    )
  }
}

export default ModalSource
