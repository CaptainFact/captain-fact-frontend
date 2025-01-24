import { CircleHelp } from 'lucide-react'
import React, { PureComponent } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { addModal } from '../../state/modals/reducer'
import HelpModal from '../Help/HelpModal'
import Achievement from './Achievement'

@connect((state) => ({ user: state.DisplayedUser.data }), { addModal })
@withTranslation('achievements')
class UserProfile extends PureComponent {
  render() {
    const {
      user: { achievements },
      t,
    } = this.props
    return (
      <div className="content mx-auto py-12">
        <div className="w-full text-center">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <span className="ml-2">{t('title')}</span>
          </h2>
          <button
            className="inline-flex items-center hover:underline hover:text-primary"
            onClick={this.achievementsHelpModal.bind(this)}
          >
            <CircleHelp size={20} />
            <span className="ml-1">{t('about')}</span>
          </button>

          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {achievements.map((id) => (
              <div key={id} className="w-full max-w-[325px] sm:w-1/2 lg:w-1/3 p-2">
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
