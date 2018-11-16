import { connect } from 'react-redux'
import { isAuthenticated } from './../../state/users/current_user/selectors'
import { fetchCurrentUser } from './../../state/users/current_user/effects'
import Page from './presentational'

const mapDispatchToProps = (dispatch, props) => ({
  componentDidMount: () => {
    if (!props.isAuthenticated) {
      dispatch(fetchCurrentUser())
    }
  }
})


const mapStateToProps = (state) => ({
  locale: state.UserPreferences.locale,
  isAuthenticated: isAuthenticated(state)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page)
