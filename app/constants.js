/* ------ Server & API ------ */

// Channels
export const VIDEO_DEBATE_CHANNEL = 'video_debate'
export const VIDEO_DEBATE_HISTORY_CHANNEL = 'video_debate_history'
export const STATEMENTS_HISTORY_CHANNEL = 'statement_history'
export const STATEMENTS_CHANNEL = 'statements'
export const COMMENTS_CHANNEL = 'comments'

// Misc
export const NO_INTERNET_ERROR = 'errors:server.noInternet'
export const SUPPORTED_LOCALES = ['en', 'fr', 'ar']

// Actions
export const ACTION_CREATE = 'create'
export const ACTION_REMOVE = 'remove'
export const ACTION_UPDATE = 'update'
export const ACTION_DELETE = 'delete'
export const ACTION_ADD = 'add'
export const ACTION_RESTORE = 'restore'
export const ACTION_FLAG = 'flag'
export const ACTION_VOTE_UP = 'vote_up'
export const ACTION_VOTE_DOWN = 'vote_down'
export const ACTION_SELF_VOTE = 'self_vote'
export const ACTION_REVERT_VOTE_UP = 'revert_vote_up'
export const ACTION_REVERT_VOTE_DOWN = 'revert_vote_down'
export const ACTION_REVERT_SELF_VOTE = 'revert_self_vote'
export const ACTION_BANNED_BAD_LANGUAGE = 'action_banned_bad_language'
export const ACTION_BANNED_BAD_SPAM = 'action_banned_spam'
export const ACTION_BANNED_BAD_IRRELEVANT = 'action_banned_irrelevant'
export const ACTION_BANNED_BAD_NOT_CONSTRUCTIVE = 'action_banned_not_constructive'

// Moderation actions
export const MODERATION_ACTION_CONFIRM = 1
export const MODERATION_ACTION_NOTSURE = 0
export const MODERATION_ACTION_ABUSIVE = -1

// Entities
export const ENTITY_VIDEO = 'video'
export const ENTITY_SPEAKER = 'speaker'
export const ENTITY_STATEMENT = 'statement'
export const ENTITY_COMMENT = 'comment'
export const ENTITY_SOURCED_COMMENT = 'fact'
export const ENTITY_USER = 'user'
export const ENTITY_USER_ACTION = 'user_action'

// Required reputations
export const MIN_REPUTATION_ADD_STATEMENT = -5
export const MIN_REPUTATION_UPDATE_STATEMENT = 15
export const MIN_REPUTATION_FLAG = 15
export const MIN_REPUTATION_UPDATE_SPEAKER = 75
export const MIN_REPUTATION_ADD_SPEAKER = 30
export const MIN_REPUTATION_REMOVE_STATEMENT = 75
export const MIN_REPUTATION_RESTORE_ENTITY = 75
export const MIN_REPUTATION_REMOVE_SPEAKER = 75
export const MIN_REPUTATION_UPDATE_VIDEO = 75
export const MIN_REPUTATION_ADD_VIDEO = 75
export const MIN_REPUTATION_MODERATION = 125

/* ------ UI, animations ------ */

export const MOBILE_WIDTH_THRESHOLD = 768 // TODO Use syled-components theme
export const FULLHD_WIDTH_THRESHOLD = 1408 // TODO Use syled-components theme

export const USER_PICTURE_SMALL = 24
export const USER_PICTURE_LARGE = 48
export const USER_PICTURE_XLARGE = 96

// Duration during which statement should stay focused
export const STATEMENT_FOCUS_TIME = 30 // seconds

// Flash messages duration
export const DEFAULT_FLASH_DURATION = 6000 // milliseconds

// Above this nesting, comments will be automatically collapsed
export const COLLAPSE_REPLIES_AT_NESTING = 2

/* ------ Forms ------ */

// User
export const PASSWORD_LENGTH = [6, 255]
export const USERNAME_LENGTH = [5, 15]
export const NAME_LENGTH = [2, 20]

// Comments
export const COMMENT_LENGTH = [0, 512]

// Speakers
export const SPEAKER_NAME_LENGTH = [3, 120]
export const SPEAKER_TITLE_LENGTH = [3, 240]
export const MAX_VIDEO_CARD_SPEAKERS = 5

// Statement
export const STATEMENT_LENGTH = [10, 255]
// The minimum number of positive votes summed over all the comments for a
// statement to be considered confirmed
export const CONFIRMED_STATEMENT_MIN_VOTES = 0

// Videos
export const ALL_VIDEOS = 'ALL_VIDEOS'
export const ONLY_PARTNERS = 'ONLY_PARTNERS'
export const ONLY_COMMUNITY = 'ONLY_COMMUNITY'

/* ------ Third party providers ------ */
export const VIDEO_PLAYER_YOUTUBE = 'youtube'
