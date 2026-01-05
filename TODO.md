# For agent

- [ ] User flags are not surfaced in the videodebate UI
- [ ] Adding a link in a comment text shows wrong error message (should be the message from the API)
- [ ] Adding a link in a statement text shows wrong error message (should be the message from the API)
- [ ] Autoscroll => doesn't seem to work
- [ ] Same for linking directly to a comment, it doesn't scroll to it

# Now

- [ ] Handle errors properly, with toasts. There are many console.error('Failed to delete comment:', error) in the codebase.
- [x] Flag modal not working
- [x] Not finished app/components/Moderation/ModerationForm.jsx
- [x] I18n ModerationForm
- [ ] whenever a comment score is updated, refetch user's vote for it. or refetch votes regularly
- [ ] Bug: add multiple times the same source, further comments are not displayed
- [ ] we use cache.modify in the subscriptions update. this is not right for reacting to things like "comment_updated". We should use cache.writeFragment instead.
- [ ] review commentScoreDiff logic
- [ ] the video column re-renders every second

# To test

- [x] BackgroundNotifier
- [ ] drafts
- [ ] transcription
- [ ] search
- [ ] deconnect/catchup

# Follow-ups

- [ ] Remove withTranslation/withRouter hooks and replace with hooks

# Ideas

- [ ] Add a timeline on the statements list, to better understand that the statements are ordered by time.
- [ ] Sidebar
  - [ ] Put flag inside select
  - [ ] Try to put language and theme on single lines, with input next to the label
