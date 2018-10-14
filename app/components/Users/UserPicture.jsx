import React from 'react'


const UserPicture = ({ user: { id, picture_url, mini_picture_url }, size }) => (
  <figure className={`image user-picture is-${size}x${size}`}>
    {id && <img src={size < 48 ? mini_picture_url : picture_url} />}
  </figure>
)

export default UserPicture
