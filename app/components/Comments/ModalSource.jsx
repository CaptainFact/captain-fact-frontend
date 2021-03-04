import React from 'react'
import { connect } from 'react-redux'
import Modal from '../Modal/Modal'
import { popModal } from '../../state/modals/reducer'

import { LoadingFrame } from '../Utils/LoadingFrame'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

import styled from 'styled-components'
import { Flex, Box } from '@rebass/grid'
import { TimesCircle } from 'styled-icons/fa-solid/TimesCircle'
import { LinkExternal } from 'styled-icons/octicons/LinkExternal'

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

const IframeContainer = styled.div`
  background-color: white;
  height: 100%;
`

class ModalSource extends React.PureComponent {
  state = { isLoading: true }

  renderUrlBarHeader = (url, title, website_name) => {
    const { popModal } = this.props
    const titleToDisplay = title === null ? website_name : title

    return (
      <UrlBarHeader justifyContent="space-between">
        <Box>
          <StyledExternalLinkNewTab href={url} title={titleToDisplay}>
            <LinkExternal size="1em" />
            <UrlBarTitle ml="0.2em">{titleToDisplay}</UrlBarTitle>
          </StyledExternalLinkNewTab>
        </Box>
        <CloseButton size="1.5em" title="Close" onClick={popModal} />
      </UrlBarHeader>
    )
  }

  render() {
    const { source, ...otherProps } = this.props
    const { url, title, website_name } = source

    return (
      <Modal
        customHeader={this.renderUrlBarHeader(url, title, website_name)}
        overrideContentStructure
        isModalSource
        {...otherProps}
      >
        <IframeContainer>
          {this.state.isLoading && <LoadingFrame />}
          <iframe
            sandbox=""
            src={url}
            style={{
              width: '100%',
              height: '100%',
              display: this.state.isLoading ? 'none' : 'block',
            }}
            onLoad={() => this.setState({ isLoading: false })}
          />
        </IframeContainer>
      </Modal>
    )
  }

  componentDidMount() {
    window.location.assign('#source')
  }
}

export default connect(null, { popModal })(ModalSource)
