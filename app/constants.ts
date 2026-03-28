/* ------ Server & API ------ */

// Misc
export const SUPPORTED_LOCALES = ['fr', 'en', 'ar', 'es', 'pt_BR', 'eo', 'ru']
export const MAX_DAILY_REPUTATION_GAIN = 25

// Actions
export const ACTION_REMOVE = 'remove'
export const ACTION_UPDATE = 'update'
export const ACTION_DELETE = 'delete'
export const ACTION_ADD = 'add'
export const ACTION_RESTORE = 'restore'

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

// Required reputations
export const MIN_REPUTATION_ADD_STATEMENT = -5
export const MIN_REPUTATION_ADD_UNLISTED_VIDEO = 15
export const MIN_REPUTATION_START_AUTOMATIC_STATEMENTS_EXTRACTION = 450
export const MIN_REPUTATION_UPDATE_STATEMENT = 15
export const MIN_REPUTATION_FLAG = 15
export const MIN_REPUTATION_UPDATE_SPEAKER = 75
export const MIN_REPUTATION_ADD_SPEAKER = 30
export const MIN_REPUTATION_REMOVE_STATEMENT = 75
export const MIN_REPUTATION_REMOVE_SPEAKER = 75
export const MIN_REPUTATION_UPDATE_VIDEO = 75
export const MIN_REPUTATION_ADD_VIDEO = 75
export const MIN_REPUTATION_MODERATION = 125

/* ------ UI, animations ------ */

export const TABLET_WIDTH_THRESHOLD = 1024
export const FULLHD_WIDTH_THRESHOLD = 1408

export const USER_PICTURE_SMALL = 24
export const USER_PICTURE_LARGE = 48
export const USER_PICTURE_XLARGE = 96

// Duration during which statement should stay focused
export const STATEMENT_FOCUS_TIME = 30 // seconds

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
export const MAX_VIDEO_CARD_SPEAKERS = 3

// Statement
export const STATEMENT_LENGTH = [10, 280]
// The minimum number of positive votes summed over all the comments for a
// statement to be considered confirmed
export const CONFIRMED_STATEMENT_MIN_VOTES = 0

// Videos
export const ALL_VIDEOS = 'ALL_VIDEOS'
export const ONLY_PARTNERS = 'ONLY_PARTNERS'
export const ONLY_COMMUNITY = 'ONLY_COMMUNITY'
export const ONLY_FEATURED = 'ONLY_FEATURED'

/* ------ Third party providers ------ */
export const VIDEO_PLAYER_YOUTUBE = 'youtube'
