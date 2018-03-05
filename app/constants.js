/* ------ Server & API ------ */
// Channels
export const VIDEO_DEBATE_CHANNEL = "video_debate"
export const VIDEO_DEBATE_HISTORY_CHANNEL = "video_debate_history"
export const STATEMENTS_HISTORY_CHANNEL = "statement_history"
export const STATEMENTS_CHANNEL = "statements"
export const COMMENTS_CHANNEL = "comments"

// Misc
export const NO_INTERNET_ERROR = 'errors:server.noInternet'

// Actions
export const ACTION_CREATE = 1
export const ACTION_REMOVE = 2
export const ACTION_UPDATE = 3
export const ACTION_DELETE = 4
export const ACTION_ADD = 5
export const ACTION_RESTORE = 6

// Moderation actions
export const MODERATION_ACTION_CONFIRM = 1
export const MODERATION_ACTION_NOTSURE = 0
export const MODERATION_ACTION_ABUSIVE = -1

// Entities
export const ENTITY_VIDEO = 1
export const ENTITY_SPEAKER = 2
export const ENTITY_STATEMENT = 3
export const ENTITY_COMMENT = 4

/* ------ UI, animations ------ */
export const USER_PICTURE_SMALL = 24
export const USER_PICTURE_MEDIUM = 40
export const USER_PICTURE_LARGE = 48
export const USER_PICTURE_XLARGE = 96

// Duration during which statement should stay focused
export const STATEMENT_FOCUS_TIME = 30 // seconds
export const MOBILE_WIDTH_THRESHOLD = 768 // pixels

export const DEFAULT_FLASH_DURATION = 6000 // milliseconds

// Required reputations
export const MIN_REPUTATION_MODERATION = 500
export const MIN_REPUTATION_ADD_VIDEO = 200
export const MIN_REPUTATION_ADD_SPEAKER = 30
export const MIN_REPUTATION_UPDATE_SPEAKER = 75
export const MIN_REPUTATION_REMOVE_SPEAKER = 125
export const MIN_REPUTATION_ADD_STATEMENT = -5
export const MIN_REPUTATION_UPDATE_STATEMENT = 15
export const MIN_REPUTATION_REMOVE_STATEMENT = 75
export const MIN_REPUTATION_RESTORE_ENTITY = 75
export const MIN_REPUTATION_UPDATE_VIDEO = 200

/* ------ Forms ------ */
// User
export const PASSWORD_LENGTH = [6, 255]
export const USERNAME_LENGTH = [5, 15]
export const NAME_LENGTH = [2, 20]

// Comments
export const COMMENT_LENGTH = [0, 240]

// Speakers
export const SPEAKER_NAME_LENGTH = [3, 60]
export const SPEAKER_TITLE_LENGTH = [3, 60]

// Statement
export const STATEMENT_LENGTH = [10, 240]

