import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, getFormValues } from 'redux-form'
import { translate } from 'react-i18next'
import isURL from 'validator/lib/isURL'
import { withRouter } from 'react-router'

import { validateLength } from '../../lib/form_validators'
import { COMMENT_LENGTH, USER_PICTURE_LARGE } from '../../constants'
import TextareaAutosize from '../FormUtils/TextareaAutosize'
import CloseButton from '../Utils/CloseButton'
import Icon from '../Utils/Icon'
import Tag from '../Utils/Tag'
import UserAppellation from '../Users/UserAppellation'
import { postComment } from '../../state/video_debate/comments/effects'
import UserPicture from '../Users/UserPicture'
import MediaLayout from '../Utils/MediaLayout'
import { handleFormEffectResponse } from '../../lib/handle_effect_response'
import { CommentDisplay } from './CommentDisplay'
import TextareaLengthCounter from '../FormUtils/TextareaLengthCounter'
import { isAuthenticated } from '../../state/users/current_user/selectors'
import { flashErrorUnauthenticated } from '../../state/flashes/reducer'
import ControlInput from '../FormUtils/ControlInput'
import { cleanStrMultiline } from '../../lib/clean_str'


const validate = ({ source, text }) => {
  const errors = {}
  const url = source ? source.url : null
  const hasValidUrl = url && isURL(url, {protocols: ['http', 'https']})
  if (url && !hasValidUrl)
    errors.source = {url: 'Invalid URL'}
  if (!hasValidUrl && !text)
    errors.text = true
  else if (text)
    validateLength(errors, 'text', text, COMMENT_LENGTH, 'Comment')
  return errors
}

class CommentField extends React.PureComponent {
  render() {
    const { input, label, placeholder, isReply, meta: { submitting, error }, autoFocus = false } = this.props

    return (
      <p className="control">
        <TextareaAutosize
          {...input}
          placeholder={placeholder || label}
          disabled={submitting}
          focus={isReply}
          autoFocus={autoFocus}
        />
        <TextareaLengthCounter length={input.value.length} maxLength={COMMENT_LENGTH[1]}/>
        {error && <span className="help is-danger">{typeof (error) === 'string' ? error : error[0]}</span>}
      </p>
    )
  }
}

@connect((state, props) => {
  const formValues = getFormValues(props.form)(state)
  return {
    sourceUrl: formValues && formValues.source ? formValues.source.url : null,
    replyTo: formValues && formValues.reply_to,
    currentUser: state.CurrentUser.data,
    isAuthenticated: isAuthenticated(state)
  }
}, {postComment, flashErrorUnauthenticated})
@reduxForm({form: 'commentForm', validate})
@translate('videoDebate')
@withRouter
export class CommentForm extends React.Component {
  state = { isCollapsed: true }

  render() {
    const { valid, currentUser, sourceUrl, replyTo, t } = this.props

    if (!this.props.currentUser.id || this.state.isCollapsed && !replyTo)
      return (
        <div className="comment-form collapsed">
          <a className="button is-inverted is-primary" onClick={() => this.expandForm()}>
            <Icon name="plus" size="medium"/>
            <span>{t('comment.revealForm')}</span>
          </a>
        </div>
      )

    return (
      <MediaLayout
        ContainerType="form"
        containerProps={{onSubmit: this.postAndReset(c => this.props.postComment(c))}}
        className="comment-form"
        left={<UserPicture user={currentUser} size={USER_PICTURE_LARGE}/>}
        content={
          <div>
            {replyTo &&
            <div>
              <Tag size="medium" className="replyTo">
                <CloseButton onClick={() => this.props.change('reply_to', null)}/>
                <span>
                  {t('comment.replyingTo')} <UserAppellation user={replyTo.user}/>
                </span>
              </Tag>
              <CommentDisplay
                className="quoted"
                richMedias={false}
                comment={replyTo}
                withoutActions
                withoutHeader
                hideThread
              />
            </div>
            }
            <Field
              component={CommentField}
              className="textarea"
              name="text"
              isReply={!!replyTo}
              normalize={cleanStrMultiline}
              placeholder={t('comment.writeComment')}
              autoFocus
            />
            <div className="level">
              <Field
                component={ControlInput}
                name="source.url"
                label={t('comment.addSource')}
                normalize={s => s.trim()}
              />
              <div className="submit-btns">
                { this.renderSubmit(valid, sourceUrl, replyTo) }
              </div>
            </div>
          </div>
        }
      />
    )
  }

  renderSubmit(valid, sourceUrl, isReply) {
    const disabled = !valid
    const i18nParams = isReply ? {context: 'reply'} : null
    if (!sourceUrl) return (
      <button type="submit" className="button" disabled={disabled}>
        {this.props.t('comment.post', i18nParams)}
      </button>
    )
    return (
      <React.Fragment>
        <button key="comment" type="submit" className="button" disabled={disabled}>
          {this.props.t('comment.post', i18nParams)}
        </button>
        <button
          key="refute"
          type="submit"
          className="button is-danger"
          disabled={disabled}
          onClick={this.postAndReset(values => this.props.postComment({...values, approve: false}))}
        >
          {this.props.t('comment.refute', i18nParams)}
        </button>
        <button
          key="approve"
          type="submit"
          className="button is-success"
          disabled={disabled}
          onClick={this.postAndReset(values => this.props.postComment({...values, approve: true}))}
        >
          {this.props.t('comment.approve', i18nParams)}
        </button>
      </React.Fragment>
    )
  }

  expandForm() {
    if (this.props.isAuthenticated)
      this.setState({isCollapsed: false})
    else
      this.props.flashErrorUnauthenticated()
  }

  postAndReset(postFunc) {
    return this.props.handleSubmit(comment => {
      if (comment.reply_to) {
        comment.reply_to_id = comment.reply_to.id
        delete (comment.reply_to)
      }
      return postFunc(comment).then(handleFormEffectResponse({
        onSuccess: () => this.props.reset()
      }))
    })
  }
}
