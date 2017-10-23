import { List } from "immutable"
import createCachedSelector from 're-reselect'


export const getAllComments = (state) => state.VideoDebate.comments.comments

export const areCommentsLoading = (state) => state.VideoDebate.comments.isLoading

export const getStatementAllComments = (state, props) =>
  getAllComments(state).get(props.statement.id, new List())

export const getStatementComments = createCachedSelector(
  getStatementAllComments,
  comments => comments.filter(c => !c.source || c.approve === null)
)((state, props) => props.statement.id)

export const getStatementApprovingFacts = createCachedSelector(
  getStatementAllComments,
  comments => comments.filter(c => c.source && c.approve === true)
)((state, props) => props.statement.id)

export const getStatementRefutingFacts = createCachedSelector(
  getStatementAllComments,
  comments => comments.filter(c => c.source && c.approve === false)
)((state, props) => props.statement.id)
