import React from 'react'
import { withTranslation } from 'react-i18next'

import { cn } from '@/lib/css-utils'

import imgAmbassador from '../../assets/achievements/ambassador.jpg'
import videoAmbassador from '../../assets/achievements/ambassador.mp4'
import imgArtist from '../../assets/achievements/artist.jpg'
import imgBug from '../../assets/achievements/bug.jpg'
import videoBug from '../../assets/achievements/bug.mp4'
import imgBulletproof from '../../assets/achievements/bulletproof.png'
// Import all achievements images
import imgDefault from '../../assets/achievements/default.png'
import imgFamous from '../../assets/achievements/famous.jpg'
import videoFamous from '../../assets/achievements/famous.mp4'
import imgGoodVibes from '../../assets/achievements/goodVibes.jpg'
import imgHelp from '../../assets/achievements/help.jpg'
import imgRobot from '../../assets/achievements/robot.jpg'
import videoRobot from '../../assets/achievements/robot.mp4'
import imgSocialAddict from '../../assets/achievements/socialAddict.jpg'
import videoSocialAddict from '../../assets/achievements/socialAddict.mp4'
import imgTrump from '../../assets/achievements/trump.png'
import imgWelcome from '../../assets/achievements/welcome.jpg'
// Import all achievements videos
import videoWelcome from '../../assets/achievements/welcome.mp4'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'

const KNOWN_ACHIEVEMENTS = {
  1: { img: imgWelcome, video: videoWelcome, borderClass: 'shiny-border' },
  2: { img: imgRobot, video: videoRobot, borderClass: 'shiny-border' },
  3: { img: imgHelp, borderClass: 'shiny-border' },
  4: { img: imgBulletproof, borderClass: 'shiny-border' },
  5: { img: imgTrump, borderClass: 'gold-border' },
  6: { img: imgSocialAddict, video: videoSocialAddict, borderClass: 'shiny-border' },
  7: { img: imgAmbassador, video: videoAmbassador, borderClass: 'rainbow-border' },
  8: { img: imgBug, video: videoBug, borderClass: 'gold-border' },
  9: { img: imgFamous, video: videoFamous, borderClass: 'gold-border' },
  10: { img: imgArtist, borderClass: 'rainbow-border' },
  11: { img: imgGoodVibes, borderClass: 'gold-border' },
}

const UNKNOWN_ACHIEVEMENT = { img: imgDefault }

const renderVisual = ({ img, video }) =>
  video ? (
    <video
      src={video}
      poster={img}
      autoPlay
      loop
      controls={false}
      className="w-full h-48 object-cover rounded-t-xl"
    />
  ) : (
    <img src={img} alt="" className="w-full h-48 object-cover rounded-t-xl" />
  )

const Achievement = ({ t, id }) => {
  const { title, description } = t(id, { returnObjects: true })
  const achievement = KNOWN_ACHIEVEMENTS[id] || UNKNOWN_ACHIEVEMENT

  return (
    <div className="md:transition-all overflow-hidden md:duration-300 md:transform md:perspective-1000 md:hover:scale-105 rounded-2xl hover:shadow-lg">
      <Card className={cn('p-3 max-w-[350px] mx-auto', achievement.borderClass)}>
        <div className="bg-gray-800 rounded-2xl">
          <div className="w-full">{renderVisual(achievement)}</div>
          <CardHeader>
            <CardTitle
              className="text-2xl text-center font-bold text-white pb-5
          transition-all duration-300 [text-shadow:0_0_5px_#4299e1] md:hover:[text-shadow:0_0_20px_#4299e1]"
            >
              {title}
            </CardTitle>
          </CardHeader>
          <Separator className="w-8/12 mx-auto mb-3 bg-gray-600" />
          <CardContent>
            <p className="text-center text-gray-100">{description}</p>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}

export default withTranslation('achievements')(Achievement)
