import { Formik } from 'formik'
import { get } from 'lodash'
import { Check, CircleX, HelpCircle, MessagesSquare, Plus, ShieldBan } from 'lucide-react'
import PropTypes from 'prop-types'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import isURL from 'validator/lib/isURL'

import { cn } from '@/lib/css-utils'
import { toastError, toastErrorUnauthenticated } from '@/lib/toasts'

import { COMMENT_LENGTH, USER_PICTURE_LARGE } from '../../constants'
import { cleanStrMultiline } from '../../lib/clean_str'
import { validateLengthI18n } from '../../lib/form_validators'
import { logError } from '../../logger'
import { postComment } from '../../state/video_debate/comments/effects'
import TextareaLengthCounter from '../FormUtils/TextareaLengthCounter'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import UserAppellation from '../Users/UserAppellation'
import UserPicture from '../Users/UserPicture'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { CommentDisplay } from './CommentDisplay'

@connect(null, { postComment })
@withTranslation('videoDebate')
@withRouter
class CommentForm extends React.Component {
  static propTypes = {
    /** Statement ID */
    statementID: PropTypes.number.isRequired,
    /** Callback to set the reply */
    setReplyToComment: PropTypes.func.isRequired,
    /** The comment we want to reply to */
    replyTo: PropTypes.shape({ id: PropTypes.number }),
    /** The commenting user, or null if none is logged in */
    user: PropTypes.object,
    /** @ignore *from withTranslation* */
    t: PropTypes.func.isRequired,
    /** Do we incitate to participate */
    inciteToParticipate: PropTypes.oneOf(['approve', 'refute']),
  }

  state = { isCollapsed: true }

  expandForm() {
    if (this.props.user) {
      this.setState({ isCollapsed: false })
    } else {
      toastErrorUnauthenticated()
    }
  }

  onSubmit = ({ text, source, approve }, { resetForm, setErrors }) => {
    return this.props
      .postComment({
        statement_id: this.props.statementID,
        text: text.length ? text : null,
        source: source ? { url: source } : null,
        reply_to_id: get(this.props, 'replyTo.id', null),
        approve,
      })
      .then((e) => {
        if (e.error) {
          setErrors(e.payload)
        } else {
          this.props.setReplyToComment(null)
          resetForm()
        }
      })
      .catch((e) => {
        logError(e)
        toastError(e)
      })
  }

  validate = ({ source, text }) => {
    const { t } = this.props
    const errors = {}

    if (source && !isURL(source, { protocols: ['http', 'https'] })) {
      errors.source = { url: t('comment.invalidURL') }
    }

    if (text) {
      validateLengthI18n(t, errors, 'text', text, COMMENT_LENGTH, 'Comment')
    }

    return errors
  }

  renderHelpMessage() {
    const { t } = this.props

    return (
      <Card className="my-3">
        <CardHeader>
          <CardTitle>{t('comment.helpTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="mb-2">
            <p>{t('comment.help1')}</p>
          </div>
          <div className="mb-2">
            <p>
              <strong>{t('comment.boldHelp2')}</strong> {t('comment.help2')}{' '}
              <i>{t('comment.help2Quote')}</i>
            </p>
          </div>
          <div className="mb-3">
            <p>
              <strong>{t('comment.boldHelp3')}</strong> {t('comment.help3')}{' '}
              <ExternalLinkNewTab href="https://informationisbeautiful.net/visualizations/rhetological-fallacies/">
                {t('comment.help3Link')}
              </ExternalLinkNewTab>
              .
            </p>
            {t('comment.helpFallacy')}{' '}
            <ExternalLinkNewTab
              href={`https://yourlogicalfallacyis.com/${t('comment.fallacyFallacyUrl')}`}
            >
              {t('comment.fallacyLink')}
            </ExternalLinkNewTab>
            .
          </div>
          <ExternalLinkNewTab className="button" href="/help/contributionGuidelines">
            {t('comment.helpButton')}
            <HelpCircle size={15} className="ml-1 inline-block" />
          </ExternalLinkNewTab>
        </CardContent>
      </Card>
    )
  }

  renderSubmitButtons(values, setFieldValue, isDisabled) {
    const { replyTo, t } = this.props
    const i18nParams = replyTo ? { context: 'reply' } : null

    return !values.source ? (
      <Button
        type="submit"
        variant="outline"
        disabled={isDisabled}
        className="flex-1 whitespace-nowrap"
      >
        <MessagesSquare size={15} />
        {t('comment.post', i18nParams)}
      </Button>
    ) : (
      <div className="flex flex-1 flex-wrap min-w-[460px] gap-1">
        <div className="flex flex-1 gap-1">
          <Button
            type="submit"
            variant="success"
            className="flex-1 whitespace-nowrap"
            disabled={isDisabled || !values.source}
            onClick={() => setFieldValue('approve', true)}
          >
            <Check size={15} />
            {t('comment.approve', i18nParams)}
          </Button>
          <Button
            type="submit"
            variant="destructive"
            className="flex-1 whitespace-nowrap"
            disabled={isDisabled}
            onClick={() => setFieldValue('approve', false)}
          >
            <ShieldBan size={15} />
            {t('comment.refute', i18nParams)}
          </Button>
        </div>
        <Button
          variant="outline"
          type="submit"
          disabled={isDisabled}
          className="flex-1 whitespace-nowrap"
        >
          <MessagesSquare size={15} />
          {t('comment.post', i18nParams)}
        </Button>
      </div>
    )
  }

  renderIncitate(values, setFieldValue, isDisabled) {
    const { replyTo, inciteToParticipate, t } = this.props
    const i18nParams = replyTo ? { context: 'reply' } : null
    const variant = inciteToParticipate === 'approve' ? 'success' : 'destructive'
    const comment = inciteToParticipate === 'approve' ? 'comment.approve' : 'comment.refute'
    const approveField = inciteToParticipate === 'approve'

    return (
      <div className="flex flex-1 flex-wrap min-w-[460px]">
        <div className="flex flex-[3_1_0%]">
          <Button
            variant={variant}
            className="my-1 mr-1 flex-1"
            disabled={isDisabled || !values.source}
            onClick={() => setFieldValue('approve', approveField)}
          >
            {t(comment, i18nParams)}
          </Button>
        </div>
      </div>
    )
  }

  renderForm() {
    const { t, inciteToParticipate } = this.props
    const initialValues = { text: '', source: '', approve: null }

    return (
      <Formik initialValues={initialValues} validate={this.validate} onSubmit={this.onSubmit}>
        {({ handleBlur, handleSubmit, values, setFieldValue, isValid, dirty, errors }) => (
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="flex flex-col">
              <div className="mb-2 relative">
                <Textarea
                  name="text"
                  value={values.text}
                  onChange={(e) => setFieldValue('text', cleanStrMultiline(e.target.value))}
                  onBlur={handleBlur}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  placeholder={t('comment.writeComment')}
                  disabled={false}
                  className="min-h-[80px] max-h-[180px]"
                />
                <TextareaLengthCounter length={values.text.length} maxLength={COMMENT_LENGTH[1]} />
                {errors.text && <span className="text-red-500 text-sm">{errors.text}</span>}
              </div>

              <div className="flex flex-wrap my-1 gap-2">
                <div className="flex flex-col flex-[3_1_330px] mr-2">
                  <Input
                    name="source"
                    value={values.source}
                    onChange={(e) => setFieldValue('source', e.target.value.trim())}
                    onBlur={handleBlur}
                    placeholder={t('comment.addSource')}
                    autoComplete="off"
                  />
                  {errors.source && (
                    <span className="text-red-500 text-sm mt-1">{errors.source.url}</span>
                  )}
                </div>

                {inciteToParticipate
                  ? this.renderIncitate(values, setFieldValue, !isValid || !dirty)
                  : this.renderSubmitButtons(values, setFieldValue, !isValid || !dirty)}
              </div>
              {this.renderHelpMessage()}
            </div>
          </form>
        )}
      </Formik>
    )
  }

  renderCollapsedForm() {
    const { inciteToParticipate, t } = this.props
    const commentIncitateTo =
      'comment.incitateTo' + (inciteToParticipate === 'approve' ? 'Confirm' : 'Refute')

    return inciteToParticipate ? (
      <div className="p-2 mb-3 text-center items-center justify-center flex flex-col text-sm">
        <span className="mt-3">{t(commentIncitateTo)}.</span>
        <Button size="xs" variant="link" onClick={() => this.expandForm()}>
          <span>&nbsp;{t('comment.addYourSource')}.</span>
        </Button>
      </div>
    ) : (
      <div className="flex justify-center p-2 border-t border-gray-200">
        <Button variant="link" onClick={() => this.expandForm()}>
          <Plus className="w-5 h-5 mr-1" />
          <span>{t('comment.revealForm')}</span>
        </Button>
      </div>
    )
  }

  render() {
    const { user, replyTo, t } = this.props
    const isSelfReply = get(user, 'id') === get(replyTo, 'user.id')

    return !user || (this.state.isCollapsed && !replyTo) ? (
      this.renderCollapsedForm()
    ) : (
      <div
        data-cy="comment-form-container"
        className={cn(
          'flex flex-col px-3 pb-3 pt-5 comment-form shadow-[0_10px_6px_-10px_#dbdbdb_inset]',
          this.props.inciteToParticipate && 'incitation-comment',
        )}
      >
        {replyTo && (
          <div className="mb-2">
            <div className="flex items-center mb-2">
              <Button
                size="icon-xs"
                variant="outline"
                className="h-7 w-7"
                onClick={() => this.props.setReplyToComment(null)}
              >
                <CircleX size={15} />
              </Button>
              <span className="ml-2 text-sm">
                {t(isSelfReply ? 'comment.replyingToSelf' : 'comment.replyingTo')}{' '}
                <UserAppellation defaultComponent="span" user={replyTo.user} />
              </span>
            </div>
            <CommentDisplay
              isQuoted
              richMedias={false}
              comment={replyTo}
              withoutActions
              withoutHeader
              hideThread
            />
          </div>
        )}
        <div className="flex">
          <div className="mr-2">
            <UserPicture user={user} size={USER_PICTURE_LARGE} />
          </div>
          {this.renderForm()}
        </div>
      </div>
    )
  }
}

export default CommentForm
