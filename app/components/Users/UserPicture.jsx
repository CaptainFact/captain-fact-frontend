import React from 'react'
import {staticResource} from '../../API/resources'


const getImageUrl = (userId, url, url_mini, size) => {
  if (!url || !url_mini)
    return `https://api.adorable.io/avatars/${size}/${userId}.png`

  if (size <= 48)
    return staticResource(url_mini)
  return staticResource(url)
}

const UserPicture = ({user: {id, picture_url, mini_picture_url}, size}) =>
  <figure className={`image user-picture is-${size}x${size}`}>
    {id && <img src={getImageUrl(id, picture_url, mini_picture_url, size)}/>}
  </figure>

export default UserPicture
