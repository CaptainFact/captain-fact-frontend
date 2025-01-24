import React from 'react'
import { withTranslation } from 'react-i18next'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'
import { Warning } from 'styled-icons/material'

import FlagReasonSelect from '../Moderation/FlagReasonSelect'
import { Separator } from '../ui/separator'
import Message from '../Utils/Message'
import { CommentDisplay } from './CommentDisplay'

const YellowWarning = styled(Warning)`
  color: #ffdd57;
`

@reduxForm({ form: 'flagForm' })
@withTranslation('videoDebate')
export default class FlagForm extends React.PureComponent {
  render() {
    const { handleSubmit, t } = this.props

    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Message type="warning">
            <div className="flex items-center">
              <div className="mr-2">
                <YellowWarning size={40} />
              </div>
              <div>
                <p>{t('flagForm.warningMessage1')}</p>
                <p>{t('flagForm.warningMessage2')}</p>
                <p>{t('flagForm.warningMessage3')}</p>
              </div>
            </div>
          </Message>
        </div>
        <CommentDisplay comment={this.props.comment} withoutActions hideThread />
        <Separator className="my-4" />
        <FlagReasonSelect />
      </form>
    )
  }
}
