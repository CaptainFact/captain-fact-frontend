import { gql, useQuery } from '@apollo/client'
import { debounce } from 'lodash'
import React from 'react'
import { withNamespaces } from 'react-i18next'
import { usePopper } from 'react-popper'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'

import { forcePosition, setPlaying } from '../../state/video_debate/video/reducer'
import Statement from '../Statements/Statement'
import Container from '../StyledUtils/Container'
import { P } from '../StyledUtils/Text'
import UnstyledButton from '../StyledUtils/UnstyledButton'
import { Icon, LoadingFrame } from '../Utils'
import ClickableIcon from '../Utils/ClickableIcon'
import Message from '../Utils/Message'
import ActionBubbleMenu, { ActionBubble } from './ActionBubbleMenu'

const captionsQuery = gql`
  query VideoCaptionsQuery($videoId: ID!) {
    video(hashId: $videoId) {
      id
      captions {
        text
        start
        duration
      }
    }
  }
`

const CaptionText = styled.span`
  color: #000;
  transition:
    color 0.3s,
    text-shadow 0.3s;

  ${({ $isCurrent, $isPlaying, $isPast }) => {
    if ($isPlaying) {
      if ($isCurrent) {
        return css`
          text-shadow: #9f9f9f 1px 1px 0px;
          color: #000;
        `
      } else if (!$isPast) {
        return css`
          color: #999;
        `
      }
    }
  }}
`

// A statement is displayed before each caption whe
const getStatementsAtPosition = (statements, caption, nextCaption) => {
  if (!statements) {
    return []
  }

  const selected = []
  for (const statement of statements) {
    if (statement.time >= caption.start) {
      if (!nextCaption || statement.time < nextCaption.start) {
        selected.push(statement)
      } else {
        break
      }
    }
  }

  return selected
}

const Arrow = styled.div`
  visibility: hidden;

  &,
  &::before {
    position: absolute;
    width: 8px;
    height: 8px;
    background: white;
  }

  &::before {
    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }
`

const StatementTooltip = styled.div`
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding-bottom: 8px;
  font-size: 12px;
  box-shadow: rgb(112 112 112 / 38%) -4px 7px 8px;

  &[data-popper-placement^='top'] ${Arrow} {
    bottom: -4px;
  }
  &[data-popper-placement^='bottom'] ${Arrow} {
    top: -4px;
  }
  &[data-popper-placement^='left'] ${Arrow} {
    right: -4px;
  }
  &[data-popper-placement^='right'] ${Arrow} {
    left: -4px;
  }
`

const StatementIconButton = styled(UnstyledButton)`
  background: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 4px;
  margin-right: 4px;
  cursor: pointer;
  width: 34px;
  height: 34px;
  &:hover {
    background: #f9f9f9;
  }
`

const StatementIndicator = withNamespaces('main')(({ statement, onPlayClick, t }) => {
  const [referenceElement, setReferenceElement] = React.useState(null)
  const [popperElement, setPopperElement] = React.useState(null)
  const [arrowElement, setArrowElement] = React.useState(null)
  const [show, setShow] = React.useState(false)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      { name: 'offset', options: { offset: [0, 8] } },
      { name: 'flip', options: { fallbackPlacements: ['bottom'] } },
      { name: 'preventOverflow', options: { padding: 8 } },
    ],
  })

  return (
    <>
      <StatementIconButton ref={setReferenceElement} onClick={() => setShow(true)}>
        <Icon name="commenting-o" size="small" className="has-text-primary" />
      </StatementIconButton>

      {show && (
        <StatementTooltip ref={setPopperElement} style={styles.popper} {...attributes.popper}>
          <Statement
            statement={statement}
            speaker={statement.speaker}
            withoutActions
            customButtons={
              <React.Fragment>
                <ClickableIcon
                  name="play-circle"
                  size="action-size"
                  title={t('actions.play')}
                  onClick={() => onPlayClick(statement.time)}
                />
                <ClickableIcon
                  title={t('actions.close')}
                  name="close"
                  size="action-size"
                  onClick={() => setShow(false)}
                />
              </React.Fragment>
            }
          />
          <Arrow ref={setArrowElement} style={styles.arrow} />
        </StatementTooltip>
      )}
    </>
  )
})

const CaptionsExtractor = ({
  t,
  videoId,
  playbackPosition,
  statements,
  setPlaying,
  forcePosition,
}) => {
  const { data, loading, error } = useQuery(captionsQuery, { variables: { videoId } })
  const [selection, setSelection] = React.useState({ text: null })
  const textContainerRef = React.useRef()

  // Watch for selection changes
  React.useEffect(() => {
    const watchForSelectionChange = debounce(() => {
      if (!textContainerRef.current) {
        return
      }

      const selection = document.getSelection()
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        if (textContainerRef.current.contains(range.commonAncestorContainer)) {
          const firstNode = range.startContainer.parentNode
          setSelection({
            text: selection.toString().trim(),
            start: parseFloat(firstNode.getAttribute('data-start')) || 0,
          })
        }
      }
    }, 100)

    document.addEventListener('selectionchange', watchForSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', watchForSelectionChange)
    }
  }, [])

  if (loading) {
    return <LoadingFrame title={t('loading.captions')} />
  } else if (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return <Message type="danger">{t('captions.errorLoading')}</Message>
  } else if (!data.video.captions?.length) {
    return <Message type="info">{t('captions.notFound')}</Message>
  }

  return (
    <Container position="relative" textAlign="justify">
      <P fontSize={['16px', '20px']} lineHeight="1.5" ref={textContainerRef}>
        {data.video.captions.map((caption, index) => {
          const nextCaption = data.video.captions[index + 1]
          const statementsAtPosition = getStatementsAtPosition(statements, caption, nextCaption)
          return (
            <React.Fragment key={index}>
              {statementsAtPosition.map((statement) => (
                <StatementIndicator
                  key={statement.id}
                  statement={statement}
                  onPlayClick={(time) => {
                    setPlaying(true)
                    forcePosition(time)
                  }}
                />
              ))}
              <CaptionText
                data-start={caption.start}
                $isPlaying={Boolean(playbackPosition)}
                $isPast={playbackPosition > caption.start + caption.duration}
                $isCurrent={
                  playbackPosition >= caption.start &&
                  playbackPosition <= caption.start + caption.duration
                }
              >
                {caption.text}
              </CaptionText>{' '}
            </React.Fragment>
          )
        })}
      </P>

      <ActionBubbleMenu
        hidden={!selection.text}
        customActions={
          <ActionBubble
            iconName="play-circle"
            label={t('captions.playSelection')}
            activated
            onClick={() => {
              setPlaying(true)
              forcePosition(selection.start)
            }}
          />
        }
        getStatementInitialValues={() => {
          return {
            text: selection.text,
            time: Math.floor(selection.start),
          }
        }}
      />
    </Container>
  )
}

export default connect(
  (state) => ({
    statements: state.VideoDebate.statements.data,
    playbackPosition: state.VideoDebate.video.playback.position,
  }),
  {
    forcePosition,
    setPlaying,
  },
)(withNamespaces('videoDebate')(CaptionsExtractor))
