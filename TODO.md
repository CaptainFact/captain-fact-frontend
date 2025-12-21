# Now

- [x] Finish removing redux/redux-form
- [x] Remove react-redux
- [x] Remove legacy sockets
- [ ] Handle errors properly, with toasts. There are many console.error('Failed to delete comment:', error) in the codebase.
- [x] Setting speaker when editing statement doesn't work.
- [ ] Speaker focus in speakers list
- [x] Votes not properly recorded in "speaker" view of statement
- [x] Some links are not using the Link component
- [x] Redirected to home when visiting http://localhost:3333/u/Betree/settings directly
- [ ] Flag modal not working
- [ ] Move loggedInUser to GraphQL type (currently using a record)
- [ ] Rename all components from "V2"
- [ ] convert more components to TypeScript
- [ ] convert more components to functional components
- [ ] remove legacy withTranslation/withRouter hooks and replace with hooks
- [ ] add multiple times the same source, further comments are not displayed
- [ ] Adding a link in a comment text shows wrong error message
- [ ] Adding a link in a statement text shows wrong error message

# To test

- [ ] Autoscroll
- [ ] BackgroundNotifier
- [ ] drafts
- [ ] transcription
- [ ] search

# Ideas

- [ ] Add a timeline on the statements list, to better understand that the statements are ordered by time.
- [ ] Sidebar
  - [ ] Put flag inside select
  - [ ] Try to put language and theme on single lines, with input next to the label
