import React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router'
import { List } from 'immutable'

import styled from 'styled-components'
import { MicrophoneAlt } from 'styled-icons/boxicons-solid'

import StatementComments from './StatementComments'
import RawIcon from '../Utils/RawIcon'
import { statementURL } from '../../lib/cf_routes'

const Statement = styled.div`
  background: #31455d;
  border: 1px solid lightgrey;
  transition: box-shadow 0.5s, max-width 0.5s;
  box-shadow: rgba(10, 10, 10, 0.15) 0px 6px 14px -5px;
`

const StatementColumn = styled.div`
  max-width: 1300px;
  padding: 1em 0;
`

const StatementHeader = styled.div`
  padding: 5px;
  text-align: left;

  .speaker {
    color: #e0e7f1;
  }

  .speaker-title {
    color: lightgrey;
  }
`

const StatementText = styled.div`
  text-align: left;
  color: #e0e7f1;
  margin-left: 30px;
  padding: 1em;

  &:before {
    content: '\\201C';
    font-family: serif;
    font-style: normal;
    font-weight: 700;
    font-size: 45px;
    position: absolute;
    margin: -25px 0 0 -30px;
  }
`

const ArrowIcon = styled.span`
  && {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
`

const StatementCardFooter = styled.div`
  display: flex;
  justify-content: space-between;

  &:hover {
    background: #e0e0e0;
    cursor: pointer;

    ${ArrowIcon} {
      color: black;
    }
  }
`

const CommentsContainer = styled.div`
  background-color: #ffffff;

  li {
    color: #ffffff;
    display: inline-block;
    border-width: 1px;
    border-style: solid;
    border-radius: 8px;
    margin: 5px;
    padding: 0 0.5em;
  }

  li:first-child {
    margin-left: 10px;
  }

  li:last-child {
    margin-right: 0px;
  }

  li.approvingFacts {
    background-color: #39b714;
    border-color: #39b714;
  }

  li.refutingFacts {
    background-color: #e0454e;
    border-color: #e0454e;
  }

  li.regularComments {
    border-color: #c4c4c4;
    background-color: #c4c4c4;
  }

  .sourcesType {
    border-top: 1px solid #dbdbdb;
    background: #f1f1f1;
  }

  .comment-form {
    border-top: 1px solid #dbdbdb;
  }
`

const parseComment = (comments, speakerId) => {
  const selfComments = []
  const approvingFacts = []
  const refutingFacts = []
  const regularComments = []

  for (const comment of comments) {
    if (comment.user && comment.user.id === speakerId) {
      // TODO: not really a regular comment to count ... Should we add a counter for speaker's comments ?
      selfComments.push(comment)
    } else if (!comment.source || comment.approve === null) {
      regularComments.push(comment)
    } else if (comment.approve) {
      approvingFacts.push(comment)
    } else {
      refutingFacts.push(comment)
    }
  }

  return {
    regularComments: new List(regularComments),
    speakerComments: new List(selfComments),
    approvingFacts: new List(approvingFacts),
    refutingFacts: new List(refutingFacts),
  }
}

const StatementCard = ({ statement }) => {
  const hasComments = statement.comments.length > 0
  const [showing, setShowing] = React.useState(false)
  const parsedComment = React.useMemo(
    () => parseComment(statement.comments, statement.speakerId),
    [statement]
  )
  const { approvingFacts, refutingFacts, regularComments, speakerComments } = parsedComment
  return (
    <StatementColumn className="column is-11">
      <Statement>
        {statement.speaker && (
          <StatementHeader>
            <div>
              {statement.speaker.picture ? (
                <img alt="" className="speaker-picture" src={statement.speaker.picture} />
              ) : (
                <MicrophoneAlt size="2.75em" />
              )}
              <strong>
                <Link to={`/s/${statement.speaker.slug || statement.speaker.id}`}>
                  {statement.speaker.fullName}
                </Link>
              </strong>
            </div>
            {
              // Since speaker.title can be null, we only display it if set
              statement.speaker.title && (
                <div className="speaker-title">{statement.speaker.title}</div>
              )
            }
          </StatementHeader>
        )}
        <StatementText>{statement.text}</StatementText>
        <Link to={statementURL(statement.video.hashId, statement.id)}>
          <RawIcon name="play-circle" />
          &nbsp;
          {statement.video.title}
        </Link>
        <CommentsContainer>
          {hasComments === true && (
            <Fragment>
              <StatementCardFooter onClick={() => setShowing(!showing)}>
                <ul>
                  {approvingFacts.size > 0 && (
                    <li className="approvingFacts">{approvingFacts.size}</li>
                  )}
                  {refutingFacts.size > 0 && (
                    <li className="refutingFacts">{refutingFacts.size}</li>
                  )}
                  {regularComments.size > 0 && (
                    <li className="regularComments">{regularComments.size}</li>
                  )}
                </ul>
                <ArrowIcon className={`fa icon-chevron-${showing ? 'up' : 'down'}`} />
              </StatementCardFooter>
              {showing && (
                <Fragment>
                  <StatementComments
                    statement={statement}
                    speaker={statement.speaker}
                    setReplyToComment={() => {
                      /* TODO */
                    }}
                    comments={regularComments}
                    speakerComments={speakerComments}
                    approvingFacts={approvingFacts}
                    refutingFacts={refutingFacts}
                    withoutActions
                  />
                </Fragment>
              )}
            </Fragment>
          )}
        </CommentsContainer>
      </Statement>
    </StatementColumn>
  )
}

export default StatementCard
