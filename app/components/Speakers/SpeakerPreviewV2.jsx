import { AvatarFallback } from '@radix-ui/react-avatar'
import { Mic } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarImage } from '../ui/avatar'

const SpeakerPreviewV2 = ({ speaker, className }) => {
  if (!speaker) {
    return null
  }

  return (
    <div className={`flex items-center justify-between gap-2 animate-fadeInUp ${className || ''}`}>
      <div className="flex items-center">
        <div className="flex-none w-[50px] flex justify-center items-center mr-3">
          <Avatar className="bg-white dark:bg-background rounded-full flex items-center justify-center border border-neutral-200 dark:border-border">
            <AvatarImage src={speaker.picture} />
            <AvatarFallback>
              <Mic className="text-neutral-600 dark:text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <Link
            to={`/s/${speaker.slug || speaker.id}`}
            className="sm:font-medium sm:text-base text-sm hover:underline text-neutral-900 dark:text-foreground"
            target="_blank"
          >
            {speaker.fullName}
          </Link>
          <p className="sm:text-sm max-w-full text-xs text-neutral-600 dark:text-muted-foreground">
            {speaker.title || '...'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SpeakerPreviewV2
