import { Clock, Play, Users } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { MAX_VIDEO_CARD_SPEAKERS } from '../../constants'
import { videoURL } from '../../lib/cf_routes'
import iterateWithSeparators from '../../lib/iterate_with_separators'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { TimeSince } from '../Utils/TimeSince'

@withTranslation('videoDebate')
export class VideoCard extends React.PureComponent {
  render() {
    const { t, video } = this.props
    const { hash_id, title } = video
    const linkTarget = videoURL(hash_id)

    return (
      <Card className="overflow-hidden h-full flex flex-col group">
        <CardHeader className="p-0">
          <Link to={linkTarget} className="relative block">
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity group-hover:bg-opacity-10">
              <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100" />
            </div>
            <div className="aspect-w-16 aspect-h-9">
              <img className="w-full h-full object-cover" alt="" src={video.thumbnail} />
            </div>
          </Link>
        </CardHeader>
        <CardContent className="px-2 py-4 text-center flex-grow">
          <Link to={linkTarget} className="flex items-center h-full">
            <h4 className="text-lg font-medium text-black text-center w-full">{title}</h4>
          </Link>
        </CardContent>
        <CardFooter className="p-4 text-sm text-gray-600 border-t mt-auto">
          {this.renderVideoMetadata(video, t)}
        </CardFooter>
      </Card>
    )
  }

  renderVideoMetadata({ speakers, insertedAt }, t) {
    return (
      <div className="space-y-2 text-xs">
        <div>
          {this.renderAddedByLabel(t)} <TimeSince time={insertedAt} />
        </div>
        {speakers && speakers.length > 0 && this.renderSpeakersList(speakers, t)}
      </div>
    )
  }

  renderAddedByLabel(t) {
    return (
      <div className="text-gray-600 inline">
        <Clock className="w-4 h-4 mr-2 inline" />
        <span>{t('video.addedBy', { userType: '$t(video.user)' })}</span>
      </div>
    )
  }

  renderSpeakersList(speakers, t) {
    const nbOthers = speakers.length - MAX_VIDEO_CARD_SPEAKERS
    const speakerComponentsList = []
    const speakerIterator = iterateWithSeparators(
      speakers,
      Math.min(speakers.length, MAX_VIDEO_CARD_SPEAKERS),
      t,
      nbOthers < 1,
    )
    for (const [speaker, separator] of speakerIterator) {
      speakerComponentsList.push(
        <span key={speaker.id} className="inline align-middle">
          <span className="font-medium text-primary hover:underline">
            {this.renderSpeakerName(speaker)}
          </span>
          {separator}
        </span>,
      )
    }
    if (nbOthers > 0) {
      const title = speakers
        .slice(MAX_VIDEO_CARD_SPEAKERS)
        .map((s) => s.full_name)
        .join(', ')
      speakerComponentsList.push(
        <span key="others" className="inline align-middle">
          &nbsp;
          {t('main:misc.and')}{' '}
          <span title={title}>
            <strong>{t('main:misc.other', { count: nbOthers })}</strong>.
          </span>
        </span>,
      )
    }

    return (
      <div className="text-gray-600">
        <Users className="w-4 h-4 mr-2 inline" />
        <span className="inline align-middle">
          {t('main:misc.staring')}
          &nbsp;
        </span>
        {speakerComponentsList}
      </div>
    )
  }

  renderSpeakerName(speaker) {
    return <Link to={`/s/${speaker.slug || speaker.id}`}>{speaker.full_name}</Link>
  }
}
