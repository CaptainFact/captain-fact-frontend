import React from 'react'
import { translate } from 'react-i18next'


const pictures = {
  1: 'welcome.jpg',
  2: 'robot.jpg',
  3: 'help.jpg',
  4: 'bulletproof.png',
  5: 'trump.png',
  6: 'socialAddict.jpg',
  7: 'ambassador.jpg',
  8: 'bug.jpg',
  9: 'famous.jpg'
}

const animations = {
  1: 'welcome.mp4',
  2: 'robot.mp4',
  6: 'socialAddict.mp4',
  7: 'ambassador.mp4',
  8: 'bug.mp4',
  9: 'famous.mp4'
}

const Achievement = ({t, id}) => {
  const {title, description} = t(id, {returnObjects: true})
  const image = pictures[id] ? `/assets/achievements/${pictures[id]}` : '/assets/achievements/default.png'
  const animation = animations[id] ? `/assets/achievements/${animations[id]}` : null

  return (
    <div className="achievement">
      <div className="card has-text-centered">
        <div className="card-image">
          {!animation && <img alt="achievement" src={image}/>}
          {animation && <video alt="achievement" src={animation} poster={image} autoPlay loop controls={false}/>}
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

export default translate('achievements')(Achievement)
