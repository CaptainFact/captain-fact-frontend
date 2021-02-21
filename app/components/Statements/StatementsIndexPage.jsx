import React from 'react'
import { merge } from 'immutable'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import capitalize from 'voca/capitalize'
import { Helmet } from 'react-helmet'

import { toAbsoluteURL } from '../../lib/cf_routes'
import { Icon } from '../Utils'
import Button from '../Utils/Button'
import { commentedStatmentsFilter } from '../../state/user_preferences/reducer'
import PaginatedStatementsContainer from './PaginatedStatementsContainer'
import styled from 'styled-components'
import { themeGet } from 'styled-system'
import { Comments } from 'styled-icons/fa-solid/Comments'
import { QuestionCircle } from 'styled-icons/fa-solid/QuestionCircle'

const StatementPage = styled.div`
  text-align: center;
  margin: 0 auto;
  padding: 5vh 0.5em;
`

const StatementPageHeader = styled.section`
  min-height: 60px;
  margin-bottom: 20px;
`

const IsCommentedFilterButton = styled(Button)`
  &&.set {
    background-color: ${themeGet('colors.primary')};
    color: ${themeGet('colors.white')};
  }
`

const NavBar = styled.nav`
  && {
    justify-content: center;
  }
`

const StatementsWithCommentsFilterBar = ({ commentedStatmentsFilter, isCommented, t }) => {
  return (
    <NavBar className="level videos-filter">
      <IsCommentedFilterButton className={`${isCommented() == true ? "set" : ""}`} onClick={() => commentedStatmentsFilter(true)}>
        <Comments size="1em" />
        &nbsp;
        commented
      </IsCommentedFilterButton>
      <IsCommentedFilterButton className={`${isCommented() == false ? "set" : ""}`} onClick={() => commentedStatmentsFilter(false)}>
        <QuestionCircle size="1em" />
        &nbsp;
        to verify
      </IsCommentedFilterButton>
    </NavBar>
  )
}

@connect(
  (state) => ({
    commentedStatements: state.UserPreferences.commentedStatements,
  }),
  { commentedStatmentsFilter }
)
@withNamespaces('main')
export default class StatementsIndexPage extends React.PureComponent {
  render() {
    const { commentedStatements, commentedStatmentsFilter, t, location } = this.props
    const currentPage = parseInt(location.query.page) || 1

    return (
      <StatementPage>
        <Helmet>
          <meta property="og:url" content={toAbsoluteURL('/statements')} />
          <meta property="og:title" content="Les dernieres déclarations sur CaptainFact" />
          <meta
            property="og:description"
            content="Découvrez diverses déclarations sourcées et vérifiées par la communauté CaptainFact"
          />
        </Helmet>
        <StatementPageHeader>
          <h2 className="title is-2">
            <Icon name="television" />
            <span> {capitalize(t('entities.lastStatements'))}</span>
          </h2>
          <StatementsWithCommentsFilterBar
            commentedStatmentsFilter={(v) => commentedStatmentsFilter(v)}
            isCommented={() => this.isCommented()}
          />
        </StatementPageHeader>
         <PaginatedStatementsContainer
          baseURL={this.props.location.pathname}
          currentPage={currentPage}
          commentedStatements={commentedStatements}
         />
      </StatementPage>
    )
  }

  isCommented() {
    return this.props.commentedStatements
  }
}
