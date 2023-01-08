import { Box, Flex } from '@rebass/grid'
import React from 'react'
import { withNamespaces } from 'react-i18next'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'
import { Warning } from 'styled-icons/material'

import FlagReasonSelect from '../Moderation/FlagReasonSelect'
import Message from '../Utils/Message'
import { CommentDisplay } from './CommentDisplay'

const YellowWarning = styled(Warning)`
  color: #ffdd57;
`

@reduxForm({ form: 'flagForm' })
@withNamespaces('videoDebate')
export default class FlagForm extends React.PureComponent {
  render() {
    const { handleSubmit, t } = this.props

    return (
      <form className="form flag-form" onSubmit={handleSubmit}>
        <CommentDisplay comment={this.props.comment} withoutActions hideThread />
        <hr />
        <FlagReasonSelect />
        <hr />
        <Message type="warning">
          <Flex alignItems="center">
            <Box mr={2}>
              <YellowWarning size={40} />
            </Box>
            <Box>
              <p>{t('flagForm.warningMessage1')}</p>
              <p>{t('flagForm.warningMessage2')}</p>
              <p>{t('flagForm.warningMessage3')}</p>
            </Box>
          </Flex>
        </Message>
      </form>
    )
  }
}
