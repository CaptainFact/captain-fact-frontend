import React from 'react'
import { PlusCircle } from 'styled-icons/boxicons-solid/PlusCircle'

import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { registerClick } from '../../API/matomo'
import Button from '../Utils/Button'
import { withNamespaces } from 'react-i18next'

const BrowserExtensionInstallBtn = withNamespaces('extension')(
  ({ t, labelI18nKey, url, name, disabled = false, context }) => (
    <ExternalLinkNewTab
      href={url}
      onClick={() => context && registerClick(context, 'Button', `Install-${name}`)}
    >
      <Button style={{ width: '235px' }} className="is-large" disabled={disabled}>
        <PlusCircle size="1em" />
        &nbsp;&nbsp;{t(labelI18nKey)}
      </Button>
    </ExternalLinkNewTab>
  )
)

export const ChromeExtensionBtn = props => {
  return (
    <BrowserExtensionInstallBtn
      name="Chrome"
      labelI18nKey="buttons.chrome"
      url="https://chrome.google.com/webstore/detail/fnnhlmbnlbgomamcolcpgncflofhjckm"
      {...props}
    />
  )
}

export const FirefoxExtensionBtn = props => {
  return (
    <BrowserExtensionInstallBtn
      name="Firefox"
      labelI18nKey="buttons.firefox"
      url="https://addons.mozilla.org/addon/captainfact/"
      {...props}
    />
  )
}

export const IEExtensionBtn = props => {
  return (
    <BrowserExtensionInstallBtn labelI18nKey="buttons.ie" name="IE" disabled {...props} />
  )
}
