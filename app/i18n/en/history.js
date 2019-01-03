import * as defs from '../../constants'

export default {
  compare_show: 'Compare',
  compare_hide: 'Hide',
  compareAll: 'Compare all',
  hideAll: 'Hide all',
  when: 'When',
  who: 'Who',
  changes: 'Changes',
  revert: 'Revert',
  entity: 'Entity',
  moderation: 'Moderation',
  deletedUser: 'Deleted user',
  madeAction: '{{action}}',
  action: {
    [defs.ACTION_CREATE]: 'Created',
    [defs.ACTION_REMOVE]: 'Removed',
    [defs.ACTION_UPDATE]: 'Updated',
    [defs.ACTION_DELETE]: 'Deleted',
    [defs.ACTION_ADD]: 'Added',
    [defs.ACTION_RESTORE]: 'Restored',
    [defs.ACTION_FLAG]: 'Flagged',
    [defs.ACTION_VOTE_UP]: 'Voted up',
    [defs.ACTION_VOTE_DOWN]: 'Voted down',
    [defs.ACTION_SELF_VOTE]: 'Self voted',
    [defs.ACTION_REVERT_VOTE_UP]: 'Reverted upvote',
    [defs.ACTION_REVERT_VOTE_DOWN]: 'Reverted downvote',
    [defs.ACTION_REVERT_SELF_VOTE]: 'Reverted self vote',
    [defs.ACTION_BANNED_BAD_LANGUAGE]: 'Moderated ($t(moderation:reason.1))',
    [defs.ACTION_BANNED_BAD_SPAM]: 'Moderated ($t(moderation:reason.2))',
    [defs.ACTION_BANNED_BAD_IRRELEVANT]: 'Moderated ($t(moderation:reason.3))',
    [defs.ACTION_BANNED_BAD_NOT_CONSTRUCTIVE]: 'Moderated ($t(moderation:reason.4))'
  },
  entities: {
    [defs.ENTITY_VIDEO]: 'video',
    [defs.ENTITY_SPEAKER]: 'speaker',
    [defs.ENTITY_STATEMENT]: 'statement',
    [defs.ENTITY_COMMENT]: 'comment',
    [defs.ENTITY_SOURCED_COMMENT]: 'sourced comment',
    [defs.ENTITY_USER_ACTION]: 'action',
    [defs.ENTITY_USER]: 'user'
  }
}
