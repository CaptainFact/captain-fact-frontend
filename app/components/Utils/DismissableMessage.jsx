import React from 'react'
import PropTypes from 'prop-types'
import Message from './Message'
import { getFromLocalStorage, setLocalStorage } from '../../lib/local_storage'

const getDefaultOpen = localStorageDismissKey => {
  if (!localStorageDismissKey) {
    return true
  } else {
    return !getFromLocalStorage(localStorageDismissKey)
  }
}

/**
 * A message that can be dismissed
 */
const DismissableMessage = ({ children, header, localStorageDismissKey, ...props }) => {
  const [isDisplayed, setDisplayed] = React.useState(
    getDefaultOpen(localStorageDismissKey)
  )

  if (!isDisplayed) {
    return null
  }

  return (
    <Message
      header={header}
      {...props}
      onClose={() => {
        setDisplayed(false)
        if (localStorageDismissKey) {
          setLocalStorage(localStorageDismissKey, true)
        }
      }}
    >
      {children}
    </Message>
  )
}

DismissableMessage.propTypes = {
  localStorageDismissKey: PropTypes.string,
  children: PropTypes.node,
  header: PropTypes.node
}

export default DismissableMessage
