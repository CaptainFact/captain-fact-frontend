import React from 'react'

import { cn } from '@/lib/css-utils'

import { USER_PICTURE_LARGE, USER_PICTURE_SMALL, USER_PICTURE_XLARGE } from '../../constants'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const getInitials = ({ name, username }) => {
  if (name?.trim()) {
    return name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('')
      .slice(0, 2)
  } else {
    const upperChars = username.split('').filter((char) => char === char.toUpperCase())
    if (upperChars.length > 1) {
      return upperChars.slice(0, 2).join('')
    } else {
      return username.slice(0, 2).toUpperCase()
    }
  }
}

const UserPicture = ({
  user: { username, name, picture_url, mini_picture_url },
  size,
}: {
  user: { username: string; name: string; picture_url: string; mini_picture_url: string }
  size: typeof USER_PICTURE_SMALL | typeof USER_PICTURE_LARGE | typeof USER_PICTURE_XLARGE | 36
}) => (
  <Avatar
    data-cy="user-picture"
    className={cn(
      size === USER_PICTURE_SMALL
        ? 'w-6 h-6'
        : size === USER_PICTURE_LARGE
          ? 'w-12 h-12'
          : size === USER_PICTURE_XLARGE
            ? 'w-24 h-24'
            : size === 36
              ? 'w-[36px] h-[36px]'
              : null,
    )}
  >
    <AvatarImage src={size < 36 ? mini_picture_url : picture_url} />
    <AvatarFallback className={cn(size < 36 && 'text-xs')}>
      {getInitials({ username, name })}
    </AvatarFallback>
  </Avatar>
)

export default UserPicture
