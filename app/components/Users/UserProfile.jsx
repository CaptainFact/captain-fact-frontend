import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import Achievement from './Achievement'
import {Icon} from '../Utils/Icon'


const UserProfile = ({user: {achievements}, t}) => (
  <div className="columns" style={{paddingTop: 40}}>
    {/*<div className="column is-7">*/}
      {/*<h2 className="title is-2 is-centered has-text-centered" >*/}
        {/*<Icon size="large" name="bar-chart"/> Statistics*/}
      {/*</h2>*/}
      {/*<p>Posted x comments</p>*/}
      {/*<p>Posted x sourced comments</p>*/}
      {/*TODO: Top comments*/}
    {/*</div>*/}
    <div className="column">
      <h2 className="title is-2 is-centered has-text-centered">
        <Icon size="large" name="trophy"/> {t('title')}
      </h2>
      <div className="columns is-marginless is-multiline is-centered achievements">
        {[1,2,6,5].map(id => (
          <div key={id} className="column is-3" style={{flexBasis: 300}}>
            <Achievement id={id}/>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default connect(state => ({user: state.DisplayedUser.data}))(
  translate('achievements')(UserProfile)
)