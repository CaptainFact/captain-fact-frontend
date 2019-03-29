import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import isURL from 'validator/lib/isURL'
import { withRouter } from 'react-router'
import { get } from 'lodash'
import { Formik } from 'formik'
import styled from 'styled-components'
import { Flex, Box } from '@rebass/grid'

import { Plus } from 'styled-icons/boxicons-regular/Plus'

import { logError } from '../../logger'
import { validateLengthI18n } from '../../lib/form_validators'
import { COMMENT_LENGTH, USER_PICTURE_LARGE } from '../../constants'
import CloseButton from '../Utils/CloseButton'
import UserAppellation from '../Users/UserAppellation'
import { postComment } from '../../state/video_debate/comments/effects'
import UserPicture from '../Users/UserPicture'
import { flashErrorUnauthenticated, errorToFlash } from '../../state/flashes/reducer'
import { cleanStrMultiline } from '../../lib/clean_str'
import Button from '../Utils/Button'
import StyledInput from '../StyledUtils/StyledInput'
import TextareaLengthCounter from '../FormUtils/TextareaLengthCounter'
import TextareaAutosize from '../FormUtils/TextareaAutosize'
import { Span } from '../StyledUtils/Text'
import { CommentDisplay } from './CommentDisplay'
import Container from '../StyledUtils/Container'

const SubmitButton = styled(props => (
  <Button type="submit" my={1} flex="1 1 100px" {...props} />
))``

@connect(
  null,
  { postComment, flashErrorUnauthenticated, errorToFlash }
)
@withNamespaces('videoDebate')
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
    /** @ignore *from withNamespaces* */
    t: PropTypes.func.isRequired
  }

  state = { isCollapsed: true }

  expandForm() {
    if (this.props.user) {
      this.setState({ isCollapsed: false })
    } else {
      this.props.flashErrorUnauthenticated()
    }
  }

  onSubmit = ({ text, source, approve }, { resetForm, setErrors }) => {
    return this.props
      .postComment({
        statement_id: this.props.statementID,
        text: text.length ? text : null,
        source: source ? { url: source } : null,
        reply_to_id: get(this.props, 'replyTo.id', null),
        approve
      })
      .then(e => {
        if (e.error) {
          setErrors(e.payload)
        } else {
          resetForm()
        }
      })
      .catch(e => {
        logError(e)
        this.props.errorToFlash(e)
      })
  }

  validate = ({ source, text }) => {
    const { t } = this.props
    const errors = {}

    if (source && !isURL(source, { protocols: ['http', 'https'] })) {
      errors.source = t('comment.invalidURL')
    }

    if (text) {
      validateLengthI18n(t, errors, 'text', text, COMMENT_LENGTH, 'Comment')
    }

    return errors
  }

  renderForm() {
    const { replyTo, t } = this.props
    const initialValues = { text: '', source: '', approve: null }
    const i18nParams = replyTo ? { context: 'reply' } : null

    return (
      <Formik
        initialValues={initialValues}
        validate={this.validate}
        onSubmit={this.onSubmit}
      >
        {({ handleBlur, handleSubmit, values, setFieldValue, isValid, errors }) => (
          <Box flex="1 1" as="form" onSubmit={handleSubmit}>
            <Flex flexDirection="column">
              <Container mb={2} position="relative">
                <TextareaAutosize
                  name="text"
                  value={values.text}
                  onChange={e => setFieldValue('text', cleanStrMultiline(e.target.value))}
                  onBlur={handleBlur}
                  autoFocus
                  placeholder={t('comment.writeComment')}
                  disabled={false}
                  minHeight={80}
                  maxHeight={180}
                  focus
                />
                <TextareaLengthCounter
                  length={values.text.length}
                  maxLength={COMMENT_LENGTH[1]}
                />
                {errors.text && (
                  <Span color="red" fontSize={6}>
                    {errors.text}
                  </Span>
                )}
              </Container>

              <Flex flexWrap="wrap">
                <Flex flexDirection="column" flex="3 1 330px" mr={2} my={1}>
                  <StyledInput
                    name="source"
                    value={values.source}
                    onChange={e => setFieldValue('source', e.target.value.trim())}
                    onBlur={handleBlur}
                    placeholder={t('comment.addSource')}
                    autoComplete="off"
                  />
                  {errors.source && (
                    <Span color="red" fontSize={6} mt={1}>
                      {errors.source}
                    </Span>
                  )}
                </Flex>
                {!values.source ? (
                  <SubmitButton my={1} disabled={!isValid}>
                    {this.props.t('comment.post', i18nParams)}
                  </SubmitButton>
                ) : (
                  <Flex flex="1 1 460px" flexWrap="wrap">
                    <SubmitButton my={1} mr={1} disabled={!isValid} flex="1 1 130px">
                      {this.props.t('comment.post', i18nParams)}
                    </SubmitButton>
                    <Flex flex="3 1">
                      <SubmitButton
                        my={1}
                        mr={1}
                        className="is-success"
                        disabled={!isValid}
                        onClick={() => setFieldValue('approve', true)}
                      >
                        {this.props.t('comment.approve', i18nParams)}
                      </SubmitButton>
                      <SubmitButton
                        my={1}
                        className="is-danger"
                        disabled={!isValid}
                        onClick={() => setFieldValue('approve', false)}
                      >
                        {this.props.t('comment.refute', i18nParams)}
                      </SubmitButton>
                    </Flex>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Box>
        )}
      </Formik>
    )
  }

  render() {
    const { user, replyTo, t } = this.props
    const isSelfReply = get(user, 'id') === get(replyTo, 'user.id')

    return !user || (this.state.isCollapsed && !replyTo) ? (
      <Flex className="comment-form" p={2} justifyContent="center">
        <Button className="is-inverted is-primary" onClick={() => this.expandForm()}>
          <Plus size="1.2em" style={{ marginRight: 5 }} />
          <span>{t('comment.revealForm')}</span>
        </Button>
      </Flex>
    ) : (
      <Flex className="comment-form" flexDirection="column" p={3}>
        {replyTo && (
          <Box>
            <Flex alignItems="center" mb={2}>
              <CloseButton
                size="1.5em"
                onClick={() => this.props.setReplyToComment(null)}
              />
              <Span ml={2}>
                {t(isSelfReply ? 'comment.replyingToSelf' : 'comment.replyingTo')}{' '}
                <UserAppellation defaultComponent="span" user={replyTo.user} />
              </Span>
            </Flex>
            <CommentDisplay
              className="quoted"
              richMedias={false}
              comment={replyTo}
              withoutActions
              withoutHeader
              hideThread
            />
          </Box>
        )}
        <Flex>
          <Box mr={2}>
            <UserPicture user={user} size={USER_PICTURE_LARGE} />
          </Box>
          {this.renderForm()}
        </Flex>
      </Flex>
    )
  }
}

export default CommentForm
