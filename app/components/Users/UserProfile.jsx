import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import Achievement from './Achievement'
import { Icon } from '../Utils/Icon'
import { addModal } from '../../state/modals/reducer'
import HelpModal from '../Help/HelpModal'

@connect((state) => ({ user: state.DisplayedUser.data }), { addModal })
@withNamespaces('achievements')
class UserProfile extends PureComponent {
  render() {
    const {
      user: { achievements },
      t,
    } = this.props
    return (
      <div className="columns is-marginless" style={{ paddingTop: 40 }}>
        <div className="column has-text-centered">
          <h2 className="title is-2 is-centered">
            <Icon size="large" name="trophy" /> {t('title')}
          </h2>
          <a className="subtitle link-with-icon" onClick={this.achievementsHelpModal.bind(this)}>
            <Icon name="question-circle" />
            <span> {t('about')}</span>
          </a>
          <br />
          <br />
          <div className="columns is-marginless is-multiline is-centered achievements">
            {achievements.map((id) => (
              <div key={id} className="column is-4" style={{ flexBasis: 325 }}>
                <Achievement id={id} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  achievementsHelpModal() {
    this.props.addModal({
      Modal: HelpModal,
      props: {
        page: 'achievements',
      },
    })
  }
}

export default UserProfile
