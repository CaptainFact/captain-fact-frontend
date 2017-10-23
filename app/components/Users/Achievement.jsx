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
    <div className="card has-text-centered" style={{borderRadius: 25}}>
      <div className="card-image" style={{padding: '20px 10px'}}>
        <figure>
          <img style={{maxHeight: 125}} src={pictures[id] ? `/assets/img/achievements/${pictures[id]}` : "/assets/img/logo.png"}/>
        </figure>
      </div>
      <div className="card-content">
        <div className="content">
          <h3 className="title is-3" style={{fontWeight: 'bold'}}>
            {title}
          </h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  )
}

export default translate('achievements')(Achievement)