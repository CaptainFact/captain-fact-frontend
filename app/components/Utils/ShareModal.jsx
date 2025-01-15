import { Clipboard, Facebook, Mail, Twitter } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { ShareAlt } from 'styled-icons/boxicons-regular'

import { toast } from '@/hooks/use-toast'

import { FB_APP_ID, FRONTEND_URL } from '../../config'
import { popModal } from '../../state/modals/reducer'
import FieldWithButton from '../FormUtils/FieldWithButton'
import Modal from '../Modal/Modal'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import ExternalLinkNewTab from './ExternalLinkNewTab'

@connect(null, { popModal })
@withTranslation('main')
export default class ShareModal extends React.PureComponent {
  render() {
    const url = FRONTEND_URL + this.props.path
    const encodedUrl = encodeURIComponent(url)
    return (
      <Modal
        handleCloseClick={this.props.popModal}
        className="modal-share"
        title={
          <span>
            <ShareAlt size={14} /> {this.props.t('actions.share')}
          </span>
        }
      >
        <FieldWithButton
          id="share-link-field"
          input={{ value: url, readOnly: true }}
          buttonClassName="is-medium"
          buttonLabel={<Clipboard size="1em" />}
          buttonClickHandler={this.copyUrlToClipboard.bind(this)}
          expandInput
        />
        <Separator className="my-6" />
        <div className="flex justify-center items-center gap-3 mt-2">
          <ExternalLinkNewTab href={this.twitterLink(encodedUrl)}>
            <Button name="Twitter" title="Twitter" variant="outline" size="lg">
              <Twitter size="1em" />
            </Button>
          </ExternalLinkNewTab>
          <ExternalLinkNewTab href={this.facebookLink(encodedUrl)}>
            <Button name="Facebook" title="Facebook" variant="outline" size="lg">
              <Facebook size="1em" />
            </Button>
          </ExternalLinkNewTab>
          <ExternalLinkNewTab href={this.mailLink(encodedUrl)}>
            <Button name="Mail" title="Mail" variant="outline" size="lg">
              <Mail size="1em" />
            </Button>
          </ExternalLinkNewTab>
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

  mailLink(url) {
    return `mailto:?subject=CaptainFact.io - Fact checking&body=${url}`
  }

  copyUrlToClipboard() {
    const { t } = this.props
    document.getElementById('share-link-field').select()
    let success = false
    try {
      success = document.execCommand('copy')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`Copy failed: ${err}`)
    }
    if (success) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <Clipboard size="1em" />
            {t('misc.clipboardSuccess')}
          </div>
        ),
      })
    } else {
      toast({
        variant: 'destructive',
        description: t('misc.clipboardFail'),
      })
    }
  }
}
