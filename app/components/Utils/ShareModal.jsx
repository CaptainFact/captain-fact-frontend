import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'

import { FRONTEND_URL } from '../../config.jsenv'
import Modal from '../Modal/Modal'
import {popModal} from '../../state/modals/reducer'
import {FieldWithButton} from '../FormUtils/index'
import { FB_APP_ID } from '../../config.jsenv'
import {Icon} from './Icon'
import {flashErrorMsg, flashSuccessMsg} from '../../state/flashes/reducer'
import ThirdPartyServiceButton from '../Users/ThirdPartyServiceButton'


@connect(null, {popModal, flashErrorMsg, flashSuccessMsg})
@translate('main')
export default class ShareModal extends React.PureComponent {
  render() {
    const url = FRONTEND_URL + this.props.path
    const encodedUrl = encodeURIComponent(url)
    return (
      <Modal handleCloseClick={this.props.popModal}
             title={<span><Icon name="share-alt"/> {this.props.t('actions.share')}</span>}>
        <FieldWithButton className="is-medium share-link-field"
                         input={{value: url, readOnly: true}}
                         buttonClassName="is-medium"
                         buttonLabel={<Icon name="clipboard"/>}
                         buttonClickHandler={this.copyUrlToClipboard.bind(this)}
        />
        <hr/>
        <div style={{textAlign: 'center'}}>
          <ThirdPartyServiceButton icon="twitter" name="Twitter" url={this.twitterLink(encodedUrl)} newTab={true}/>
          <ThirdPartyServiceButton icon="facebook" name="Facebook" url={this.facebookLink(encodedUrl)} newTab={true}/>
          <ThirdPartyServiceButton icon="google-plus-official" name="Google+" url={this.googlePlusLink(encodedUrl)} newTab={true}/>
          <span style={{marginLeft: 5}}>
            <ThirdPartyServiceButton icon="envelope" name="Mail" url={this.mailLink(encodedUrl)} newTab={true}/>
          </span>
        </div>
      </Modal>
    )
  }

  twitterLink(url) {
    return `https://twitter.com/intent/tweet?url=${url}&via=CaptainFact_io`
  }

  facebookLink(url) {
    // Doesn't work with localhost
    return `https://www.facebook.com/dialog/share?app_id=${FB_APP_ID}&display=popup&href=${url}`
  }

  googlePlusLink(url) {
    return `https://plus.google.com/share?url=${url}`
  }

  mailLink(url) {
    return `mailto:?subject=CaptainFact.io - Fact checking&body=${url}`
  }

  copyUrlToClipboard() {
    document.getElementsByClassName('share-link-field')[0].select()
    let success = false
    try {success = document.execCommand('copy')} catch (err) {}
    if (success)
      this.props.flashSuccessMsg("misc.clipboardSuccess")
    else
      this.props.flashErrorMsg("misc.clipboardFail")
  }
}