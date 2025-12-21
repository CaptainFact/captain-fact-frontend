import { gql, useQuery } from '@apollo/client'
import { debounce } from 'lodash'
import { CirclePlay, CircleX, MessageCircle } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { usePopper } from 'react-popper'

import { useVideoPlayback } from '../../contexts/VideoPlaybackContext'
import { cn } from '../../lib/css-utils'
import StatementV2 from '../Statements/v2/StatementV2'
import { Button } from '../ui/button'
import ClickableIcon from '../Utils/ClickableIcon'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Message from '../Utils/Message'
import ActionBubbleMenuV2, { ActionBubble } from './v2/ActionBubbleMenuV2'

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

// A statement is displayed before each caption whe
const getStatementsAtPosition = (statements, caption, nextCaption) => {
  if (!statements) {
    return []
  }

  const selected = []
  for (const statement of statements) {
    if (statement.time >= Math.floor(caption.start)) {
      if (!nextCaption || Math.floor(nextCaption.start) > statement.time) {
        selected.push(statement)
      } else {
        break
      }
    }
  }

  return selected
}

const StatementIndicator = withTranslation('main')(({ statement, onPlayClick, t }) => {
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
      <Button
        size="icon-xs"
        variant="outline"
        className="mr-2"
        ref={setReferenceElement}
        onClick={() => setShow(true)}
      >
        <MessageCircle size={16} />
      </Button>

      {show && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className={cn(
            'bg-white border border-[#ccc] rounded-lg pb-2 text-xs shadow-[rgb(112_112_112_/_38%)_-4px_7px_8px]',
            '[&[data-popper-placement^="top"]_.arrow]:bottom-[-4px]',
            '[&[data-popper-placement^="bottom"]_.arrow]:top-[-4px]',
            '[&[data-popper-placement^="left"]_.arrow]:right-[-4px]',
            '[&[data-popper-placement^="right"]_.arrow]:left-[-4px]',
          )}
        >
          <StatementV2
            statement={statement}
            speaker={statement.speaker}
            withoutActions
            customButtons={
              <React.Fragment>
                <ClickableIcon
                  icon={<CirclePlay size={16} />}
                  size="xs"
                  title={t('actions.play')}
                  onClick={() => onPlayClick(statement.time)}
                />
                <ClickableIcon
                  title={t('actions.close')}
                  icon={<CircleX size={16} />}
                  size="xs"
                  onClick={() => setShow(false)}
                />
              </React.Fragment>
            }
          />
          <div
            ref={setArrowElement}
            style={styles.arrow}
            className="arrow invisible [&::before]:visible [&::before]:content-[''] [&::before]:absolute [&::before]:w-2 [&::before]:h-2 [&::before]:bg-white [&::before]:rotate-45 [&]:absolute [&]:w-2 [&]:h-2 [&]:bg-white"
          />
        </div>
      )}
    </>
  )
})

const CaptionsExtractor = ({ t, videoId, statements }) => {
  const { data, loading, error } = useQuery(captionsQuery, { variables: { videoId } })
  const [selection, setSelection] = React.useState({ text: null })
  const textContainerRef = React.useRef()
  const { position: playbackPosition, setPlaying, forcePosition } = useVideoPlayback()

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
    <div className="relative text-justify">
      <p className="text-base md:text-xl leading-[1.5]" ref={textContainerRef}>
        {data.video.captions.map((caption, index) => {
          const nextCaption = data.video.captions[index + 1]
          const statementsAtPosition = getStatementsAtPosition(statements, caption, nextCaption)
          const isPlaying = Boolean(playbackPosition)
          const isPast = playbackPosition > caption.start + caption.duration
          const isCurrent =
            playbackPosition >= caption.start &&
            playbackPosition <= caption.start + caption.duration
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
              <span
                data-start={caption.start}
                className={cn(
                  'text-black transition-[color,text-shadow] duration-300',
                  isPlaying && isCurrent && 'text-black [text-shadow:#9f9f9f_1px_1px_0px]',
                  isPlaying && !isPast && !isCurrent && 'text-[#999]',
                )}
              >
                {caption.text}
              </span>{' '}
            </React.Fragment>
          )
        })}
      </p>

      <ActionBubbleMenuV2
        hidden={!selection.text}
        customActions={
          <ActionBubble
            icon={CirclePlay}
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
    </div>
  )
}

export default withTranslation('videoDebate')(CaptionsExtractor)
