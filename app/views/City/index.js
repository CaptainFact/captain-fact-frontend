import { connect } from 'react-redux'
import Page from './presentational'

const mapStateToProps = (state) => ({
  reputation: state.CurrentUser.data.reputation
})

export default connect(
  mapStateToProps,
)(Page)
