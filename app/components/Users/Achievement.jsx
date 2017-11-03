import React from 'react'
import { translate } from 'react-i18next'


const pictures = {
  1: 'welcome.png',
  2: 'robot.png',
  5: 'trump.png'
}

const Achievement = ({t, id}) => {
  const {title, description} = t(id, {returnObjects: true})
  return (
    <div className="achievement">
      <div className="card has-text-centered">
        <div className="card-image">
          <figure>
            <img src={pictures[id] ? `/assets/img/achievements/${pictures[id]}` : "/assets/img/logo.png"}/>
          </figure>
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