import React from 'react'
import { UserCircle } from 'styled-icons/fa-regular'

const UserPicture = ({ user: { id, picture_url, mini_picture_url }, size }) => (
  <figure className={`image user-picture is-${size}x${size}`}>
    {!id || (!picture_url && !mini_picture_url) ? (
      <UserCircle size="1.5em" />
    ) : (
      <img src={size < 48 ? mini_picture_url : picture_url} alt="" />
    )}
  </figure>
)

export default UserPicture
