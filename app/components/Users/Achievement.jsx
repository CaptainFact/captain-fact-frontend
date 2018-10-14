import React from 'react'
import { withNamespaces } from 'react-i18next'

// Import all achievements images
import imgDefault from '../../assets/assets/achievements/default.png'
import imgWelcome from '../../assets/assets/achievements/welcome.jpg'
import imgRobot from '../../assets/assets/achievements/robot.jpg'
import imgHelp from '../../assets/assets/achievements/help.jpg'
import imgBulletproof from '../../assets/assets/achievements/bulletproof.png'
import imgTrump from '../../assets/assets/achievements/trump.png'
import imgSocialAddict from '../../assets/assets/achievements/socialAddict.jpg'
import imgAmbassador from '../../assets/assets/achievements/ambassador.jpg'
import imgBug from '../../assets/assets/achievements/bug.jpg'
import imgFamous from '../../assets/assets/achievements/famous.jpg'
import imgArtist from '../../assets/assets/achievements/artist.jpg'
import imgGoodVibes from '../../assets/assets/achievements/goodVibes.jpg'

// Import all achievements videos
import videoWelcome from '../../assets/assets/achievements/welcome.mp4'
import videoRobot from '../../assets/assets/achievements/robot.mp4'
import videoSocialAddict from '../../assets/assets/achievements/socialAddict.mp4'
import videoAmbassador from '../../assets/assets/achievements/ambassador.mp4'
import videoBug from '../../assets/assets/achievements/bug.mp4'
import videoFamous from '../../assets/assets/achievements/famous.mp4'


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
  11: { img: imgGoodVibes }
}

const UNKNOWN_ACHIEVEMENT = { img: imgDefault }

const renderVisual = ({ img, video }) => (
  video
    ? (<video src={video} poster={img} autoPlay loop controls={false} />)
    : (<img src={img} alt="" />)
)

const Achievement = ({ t, id }) => {
  const { title, description } = t(id, { returnObjects: true })
  const achievement = KNOWN_ACHIEVEMENTS[id] || UNKNOWN_ACHIEVEMENT

  return (
    <div className="achievement">
      <div className="card has-text-centered">
        <div className="card-image">
          {renderVisual(achievement)}
        </div>
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
