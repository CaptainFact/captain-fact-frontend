import React from 'react'


const getImageUrl = (userId, url, size) => {
  if (!url)
    return `https://api.adorable.io/avatars/${size}/${userId}.png`
  if (url.includes('facebook.com'))
    return url.split('?')[0] + `?width=${size}&height=${size}`
  return url
}

const UserPicture = ({user: {id, picture_url}, size}) =>
  <figure className={`image user-picture is-${size}x${size}`}>
    {id &&
      <img src={getImageUrl(id, picture_url, size)}/>
    }
  </figure>

export default UserPicture
