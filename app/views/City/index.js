import { connect } from 'react-redux'
import Page from './presentational'

const mapStateToProps = (state) => ({
  reputation: state.CurrentUser.data.reputation,
  city: state.CurrentUser.data.city,
})

export default connect(
  mapStateToProps,
)(Page)
