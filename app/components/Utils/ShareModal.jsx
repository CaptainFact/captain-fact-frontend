import { Clipboard, Facebook, Mail, Share2, Twitter } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

import { FB_APP_ID, FRONTEND_URL } from '../../config'
import FieldWithButton from '../FormUtils/FieldWithButton'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import ExternalLinkNewTab from './ExternalLinkNewTab'

const ShareModal = ({ open, onOpenChange, path }) => {
  const { t } = useTranslation('main')
  const url = FRONTEND_URL + path
  const encodedUrl = encodeURIComponent(url)

  const copyUrlToClipboard = () => {
    const field = document.getElementById('share-link-field')
    if (field) {
      field.select()
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

  const twitterLink = (url) => {
    return `https://twitter.com/intent/tweet?url=${url}&via=CaptainFact_io`
  }

  const facebookLink = (url) => {
    // Doesn't work with localhost
    return `https://www.facebook.com/dialog/share?app_id=${FB_APP_ID}&display=popup&href=${url}`
  }

  const mailLink = (url) => {
    return `mailto:?subject=CaptainFact.io - Fact checking&body=${url}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="modal-share">
        <DialogHeader>
          <DialogTitle>
            <span className="flex items-center gap-2">
              <Share2 size={14} /> {t('actions.share')}
            </span>
          </DialogTitle>
        </DialogHeader>
        <FieldWithButton
          id="share-link-field"
          input={{ value: url, readOnly: true }}
          buttonClassName="is-medium"
          buttonLabel={<Clipboard size="1em" />}
          buttonClickHandler={copyUrlToClipboard}
          expandInput
        />
        <Separator className="my-6" />
        <div className="flex justify-center items-center gap-3 mt-2">
          <ExternalLinkNewTab href={twitterLink(encodedUrl)}>
            <Button name="Twitter" title="Twitter" variant="outline" size="lg">
              <Twitter size="1em" />
            </Button>
          </ExternalLinkNewTab>
          <ExternalLinkNewTab href={facebookLink(encodedUrl)}>
            <Button name="Facebook" title="Facebook" variant="outline" size="lg">
              <Facebook size="1em" />
            </Button>
          </ExternalLinkNewTab>
          <ExternalLinkNewTab href={mailLink(encodedUrl)}>
            <Button name="Mail" title="Mail" variant="outline" size="lg">
              <Mail size="1em" />
            </Button>
          </ExternalLinkNewTab>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareModal
