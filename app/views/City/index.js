import { connect } from 'react-redux'
import Page from './presentational'

const mapStateToProps = (state) => ({
  tutorial: state.CurrentUser.data.tutorial,
  objectives: state.CurrentUser.data.objectives,
  reputation: state.CurrentUser.data.reputation,
  entities: state.CurrentUser.data.entities,
  city: state.CurrentUser.data.city,
})

export default connect(
  mapStateToProps,
)(Page)
