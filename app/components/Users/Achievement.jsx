import React from 'react'
import { withNamespaces } from 'react-i18next'

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

const KNOWN_ACHIEVEMENTS = {
  1: { img: imgWelcome, video: videoWelcome },
  2: { img: imgRobot, video: videoRobot },
  3: { img: imgHelp },
  4: { img: imgBulletproof },
  5: { img: imgTrump },
  6: { img: imgSocialAddict, video: videoSocialAddict },
  7: { img: imgAmbassador, video: videoAmbassador },
  8: { img: imgBug, video: videoBug },
  9: { img: imgFamous, video: videoFamous },
  10: { img: imgArtist },
  11: { img: imgGoodVibes },
}

const UNKNOWN_ACHIEVEMENT = { img: imgDefault }

const renderVisual = ({ img, video }) =>
  video ? (
    <video src={video} poster={img} autoPlay loop controls={false} />
  ) : (
    <img src={img} alt="" />
  )

const Achievement = ({ t, id }) => {
  const { title, description } = t(id, { returnObjects: true })
  const achievement = KNOWN_ACHIEVEMENTS[id] || UNKNOWN_ACHIEVEMENT

  return (
    <div className="achievement">
      <div className="card has-text-centered">
        <div className="card-image">{renderVisual(achievement)}</div>
        <div className="card-content">
          <div className="content">
            <h3 className="title is-3">{title}</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withNamespaces('achievements')(Achievement)
