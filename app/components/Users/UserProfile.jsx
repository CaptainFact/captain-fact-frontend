import { CircleHelp } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import HelpPageContent from '../Help/HelpPageContent'
import Achievement from './Achievement'
import { DisplayedUserContext } from './User'

const UserProfile = () => {
  const { t } = useTranslation('achievements')
  const { t: tHelp } = useTranslation('help')
  const { user } = useContext(DisplayedUserContext)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { achievements } = user || {}

  return (
    <>
      <div className="content mx-auto py-12">
        <div className="w-full text-center">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <span className="ml-2">{t('title')}</span>
          </h2>
          <button
            className="inline-flex items-center hover:underline hover:text-primary"
            onClick={() => setIsDialogOpen(true)}
          >
            <CircleHelp size={20} />
            <span className="ml-1">{t('about')}</span>
          </button>

          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {achievements?.map((id) => (
              <div key={id} className="w-full max-w-[325px] sm:w-1/2 lg:w-1/3 p-2">
                <Achievement id={id} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{tHelp('pages.achievements')}</DialogTitle>
          </DialogHeader>
          <HelpPageContent page="achievements" onLinkClick={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserProfile
