export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
  NaiveDateTime: { input: string; output: string; }
  Upload: { input: File; output: File; }
};

/** A paginated list of user actions */
export type ActivityLog = {
  __typename?: 'ActivityLog';
  entries?: Maybe<Array<Maybe<UserAction>>>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalEntries?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

/** Whether the user was a target or an author of the action */
export type ActivityLogDirection =
  /** All actions */
  | 'ALL'
  /** Actions taken by the author */
  | 'AUTHOR'
  /** Actions taken against the target */
  | 'TARGET';

/** Information about the application */
export type AppInfo = {
  __typename?: 'AppInfo';
  /** Version of the database app attached to this API */
  dbVersion: Scalars['String']['output'];
  /** Indicate if the application is running properly with a checkmark */
  status: Scalars['String']['output'];
  /** Graphql API version */
  version: Scalars['String']['output'];
};

/** A user's comment. A comment will be considered being a fact if it has a source */
export type Comment = {
  __typename?: 'Comment';
  /** Can be true / false (facts) or null (comment) */
  approve?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  /** Datetime at which the comment has been added */
  insertedAt: Scalars['NaiveDateTime']['output'];
  /** If this comment is a reply, this will point toward the comment being replied to */
  replyToId?: Maybe<Scalars['ID']['output']>;
  /** Score of the comment / fact, based on users votes */
  score: Scalars['Int']['output'];
  /** Source of the scomment. If null, a text must be set */
  source?: Maybe<Source>;
  /** ID of the statement this comment belongs to */
  statementId?: Maybe<Scalars['ID']['output']>;
  /** Text of the comment. Can be null if the comment has a source */
  text?: Maybe<Scalars['String']['output']>;
  /** User who made the comment */
  user?: Maybe<User>;
};

/** Reference to a flagged comment */
export type CommentFlagged = {
  __typename?: 'CommentFlagged';
  id: Scalars['ID']['output'];
};

/** Reference to a comment involved in a score update */
export type CommentReference = {
  __typename?: 'CommentReference';
  id: Scalars['ID']['output'];
  replyToId?: Maybe<Scalars['ID']['output']>;
  statementId?: Maybe<Scalars['ID']['output']>;
};

/** Reference to a removed comment */
export type CommentRemoved = {
  __typename?: 'CommentRemoved';
  id: Scalars['ID']['output'];
  replyToId?: Maybe<Scalars['ID']['output']>;
  statementId?: Maybe<Scalars['ID']['output']>;
};

/** A score diff published after a vote */
export type CommentScoreDiff = {
  __typename?: 'CommentScoreDiff';
  comment: CommentReference;
  diff: Scalars['Int']['output'];
};

/** A user notification */
export type Notification = {
  __typename?: 'Notification';
  /** Action the notification is referencing */
  action?: Maybe<UserAction>;
  id: Scalars['ID']['output'];
  /** Notification creation datetime */
  insertedAt: Scalars['String']['output'];
  /** When the notification has been seen, or null if it has not */
  seenAt?: Maybe<Scalars['String']['output']>;
  /** Type of the notification */
  type: Scalars['String']['output'];
};

/** The notifications status */
export type NotificationsFilter =
  /** All notifications */
  | 'ALL'
  /** Seen notifications */
  | 'SEEN'
  /** Unseen notifications */
  | 'UNSEEN';

/** A user subscription to entities changes, used by notifications generator */
export type NotificationsSubscription = {
  __typename?: 'NotificationsSubscription';
  /** Associated comment */
  comment?: Maybe<Comment>;
  /** Associated comment ID */
  commentId?: Maybe<Scalars['Int']['output']>;
  /** Unique user ID */
  id: Scalars['ID']['output'];
  /** Is the subscription active? */
  isSubscribed: Scalars['Boolean']['output'];
  /** The reason why user has subscribed */
  reason?: Maybe<Scalars['String']['output']>;
  /** The scope of the subscription */
  scope: Scalars['String']['output'];
  /** Associated statement */
  statement?: Maybe<Statement>;
  /** Associated statement ID */
  statementId?: Maybe<Scalars['Int']['output']>;
  /** Associated video */
  video?: Maybe<Video>;
  /** Associated video hash ID */
  videoHashId?: Maybe<Scalars['String']['output']>;
  /** Associated video ID */
  videoId?: Maybe<Scalars['Int']['output']>;
};

/** A paginated list of user actions */
export type PaginatedNotifications = {
  __typename?: 'PaginatedNotifications';
  entries?: Maybe<Array<Maybe<Notification>>>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalEntries?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

/** A list a paginated statements */
export type PaginatedStatements = {
  __typename?: 'PaginatedStatements';
  entries?: Maybe<Array<Maybe<Statement>>>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalEntries?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

/** A list a paginated videos */
export type PaginatedVideos = {
  __typename?: 'PaginatedVideos';
  entries?: Maybe<Array<Maybe<Video>>>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  totalEntries?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type RootMutationType = {
  __typename?: 'RootMutationType';
  /** Add an existing speaker to a video */
  addSpeakerToVideo?: Maybe<Speaker>;
  /** Create a new comment on a statement */
  createComment?: Maybe<Comment>;
  /** Create a new speaker and add it to a video */
  createSpeaker?: Maybe<Speaker>;
  /** Create a new statement on a video */
  createStatement?: Maybe<Statement>;
  /** Delete an existing comment */
  deleteComment?: Maybe<CommentRemoved>;
  /** Delete an existing statement */
  deleteStatement?: Maybe<StatementRemoved>;
  editVideo?: Maybe<Video>;
  /** Flag a comment */
  flagComment?: Maybe<CommentFlagged>;
  /** Remove a speaker from a video */
  removeSpeakerFromVideo?: Maybe<SpeakerRemoved>;
  /** Restore a removed speaker */
  restoreSpeaker?: Maybe<Speaker>;
  /** Restore a deleted statement */
  restoreStatement?: Maybe<Statement>;
  setVideoCaptions?: Maybe<Video>;
  /** Use this to start the automatic statements extraction job. Requires elevated permissions. */
  startAutomaticStatementsExtraction?: Maybe<Video>;
  /** Use this to mark a notifications as seen */
  updateNotifications?: Maybe<Array<Maybe<Notification>>>;
  /** Update an existing speaker */
  updateSpeaker?: Maybe<Speaker>;
  /** Update an existing statement */
  updateStatement?: Maybe<Statement>;
  /** Use this to (un)subscribe from an item notifications */
  updateSubscription?: Maybe<NotificationsSubscription>;
  /** Vote on a comment */
  voteComment?: Maybe<Comment>;
};


export type RootMutationTypeAddSpeakerToVideoArgs = {
  speakerId: Scalars['ID']['input'];
  videoId: Scalars['ID']['input'];
};


export type RootMutationTypeCreateCommentArgs = {
  approve?: InputMaybe<Scalars['Boolean']['input']>;
  replyToId?: InputMaybe<Scalars['ID']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  statementId: Scalars['ID']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
};


export type RootMutationTypeCreateSpeakerArgs = {
  fullName: Scalars['String']['input'];
  videoId: Scalars['ID']['input'];
};


export type RootMutationTypeCreateStatementArgs = {
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
  speakerId?: InputMaybe<Scalars['ID']['input']>;
  text: Scalars['String']['input'];
  time: Scalars['Int']['input'];
  videoId: Scalars['ID']['input'];
};


export type RootMutationTypeDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


export type RootMutationTypeDeleteStatementArgs = {
  id: Scalars['ID']['input'];
};


export type RootMutationTypeEditVideoArgs = {
  id: Scalars['ID']['input'];
  unlisted: Scalars['Boolean']['input'];
};


export type RootMutationTypeFlagCommentArgs = {
  commentId: Scalars['ID']['input'];
  reason: Scalars['Int']['input'];
};


export type RootMutationTypeRemoveSpeakerFromVideoArgs = {
  speakerId: Scalars['ID']['input'];
  videoId: Scalars['ID']['input'];
};


export type RootMutationTypeRestoreSpeakerArgs = {
  speakerId: Scalars['ID']['input'];
  videoId: Scalars['ID']['input'];
};


export type RootMutationTypeRestoreStatementArgs = {
  id: Scalars['ID']['input'];
};


export type RootMutationTypeSetVideoCaptionsArgs = {
  captions: Scalars['Upload']['input'];
  videoId: Scalars['ID']['input'];
};


export type RootMutationTypeStartAutomaticStatementsExtractionArgs = {
  videoId: Scalars['ID']['input'];
};


export type RootMutationTypeUpdateNotificationsArgs = {
  ids: Array<InputMaybe<Scalars['ID']['input']>>;
  seen: Scalars['Boolean']['input'];
};


export type RootMutationTypeUpdateSpeakerArgs = {
  fullName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  wikidataItemId?: InputMaybe<Scalars['String']['input']>;
};


export type RootMutationTypeUpdateStatementArgs = {
  id: Scalars['ID']['input'];
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
  speakerId?: InputMaybe<Scalars['ID']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<Scalars['Int']['input']>;
};


export type RootMutationTypeUpdateSubscriptionArgs = {
  entityId: Scalars['ID']['input'];
  isSubscribed: Scalars['Boolean']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  scope: Scalars['String']['input'];
};


export type RootMutationTypeVoteCommentArgs = {
  commentId: Scalars['ID']['input'];
  value: Scalars['Int']['input'];
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  /** Get all_statistics */
  allStatistics?: Maybe<Statistics>;
  /** [Deprecated] Get all videos */
  allVideos?: Maybe<Array<Maybe<Video>>>;
  /** Get app info */
  appInfo?: Maybe<AppInfo>;
  /** Get logged in user */
  loggedInUser?: Maybe<User>;
  /** Search for speakers by name */
  searchSpeakers?: Maybe<Array<Maybe<Speaker>>>;
  /** Get a single speaker */
  speaker?: Maybe<Speaker>;
  /** Get all statements */
  statements?: Maybe<PaginatedStatements>;
  /** Get user public info */
  user?: Maybe<User>;
  /** Get a single video */
  video?: Maybe<Video>;
  /** Get history actions for a video */
  videoHistoryActions?: Maybe<Array<Maybe<UserAction>>>;
  /** Get all videos */
  videos?: Maybe<PaginatedVideos>;
};


export type RootQueryTypeAllVideosArgs = {
  filters?: InputMaybe<VideoFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type RootQueryTypeSearchSpeakersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type RootQueryTypeSpeakerArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryTypeStatementsArgs = {
  filters?: InputMaybe<StatementFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type RootQueryTypeUserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryTypeVideoArgs = {
  hashId?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryTypeVideoHistoryActionsArgs = {
  videoId: Scalars['ID']['input'];
};


export type RootQueryTypeVideosArgs = {
  filters?: InputMaybe<VideoFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type RootSubscriptionType = {
  __typename?: 'RootSubscriptionType';
  /** Listen for comments added on a video */
  commentAdded?: Maybe<Comment>;
  /** Listen for comments removed on a video */
  commentRemoved?: Maybe<CommentRemoved>;
  /** Listen for comment score changes on a video */
  commentScoreDiff?: Maybe<CommentScoreDiff>;
  /** Listen for comments updated on a video */
  commentUpdated?: Maybe<Comment>;
  /** Listen for speakers added on a video */
  speakerAdded?: Maybe<Speaker>;
  /** Listen for speakers removed on a video */
  speakerRemoved?: Maybe<SpeakerRemoved>;
  /** Listen for speakers updated on a video */
  speakerUpdated?: Maybe<Speaker>;
  /** Listen for statements added on a video */
  statementAdded?: Maybe<Statement>;
  /** Listen for actions added to a statement history */
  statementHistoryActionAdded?: Maybe<UserAction>;
  /** Listen for statements removed on a video */
  statementRemoved?: Maybe<StatementRemoved>;
  /** Listen for statements updated on a video */
  statementUpdated?: Maybe<Statement>;
  /** Listen for actions added to a video history */
  videoHistoryActionAdded?: Maybe<UserAction>;
  /** Listen for video updates */
  videoUpdated?: Maybe<Video>;
};


export type RootSubscriptionTypeCommentAddedArgs = {
  videoId: Scalars['ID']['input'];
};


export type RootSubscriptionTypeCommentRemovedArgs = {
  videoId: Scalars['ID']['input'];
};


export type RootSubscriptionTypeCommentScoreDiffArgs = {
  videoId: Scalars['ID']['input'];
};


export type RootSubscriptionTypeCommentUpdatedArgs = {
  videoId: Scalars['ID']['input'];
};


export type RootSubscriptionTypeSpeakerAddedArgs = {
  videoId: Scalars['ID']['input'];
};


export type RootSubscriptionTypeSpeakerRemovedArgs = {
  videoId: Scalars['ID']['input'];
};


export type RootSubscriptionTypeSpeakerUpdatedArgs = {
  videoId: Scalars['ID']['input'];
};


export type RootSubscriptionTypeStatementAddedArgs = {
  videoId: Scalars['ID']['input'];
};


export type RootSubscriptionTypeStatementHistoryActionAddedArgs = {
  statementId: Scalars['ID']['input'];
};


export type RootSubscriptionTypeStatementRemovedArgs = {
  videoId: Scalars['ID']['input'];
};


export type RootSubscriptionTypeStatementUpdatedArgs = {
  videoId: Scalars['ID']['input'];
};


export type RootSubscriptionTypeVideoHistoryActionAddedArgs = {
  videoId: Scalars['ID']['input'];
};


export type RootSubscriptionTypeVideoUpdatedArgs = {
  videoId: Scalars['ID']['input'];
};

/** An URL pointing toward a source (article, video, pdf...) */
export type Source = {
  __typename?: 'Source';
  /** Unique id of the source */
  id: Scalars['ID']['output'];
  /** Language of the page / article */
  language?: Maybe<Scalars['String']['output']>;
  /** Site name extracted from OpenGraph */
  siteName?: Maybe<Scalars['String']['output']>;
  /** Title of the page / article */
  title?: Maybe<Scalars['String']['output']>;
  /** URL of the source */
  url: Scalars['String']['output'];
};

/** A speaker appearing in one or more videos */
export type Speaker = {
  __typename?: 'Speaker';
  /** Country code of the speaker's origin (from wikidata) */
  country?: Maybe<Scalars['String']['output']>;
  /** Full name */
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Speaker's picture URL. Format is 50x50 */
  picture?: Maybe<Scalars['String']['output']>;
  /** A unique slug to identify the speaker */
  slug?: Maybe<Scalars['String']['output']>;
  /** Official title (can have multiple separated by a comma). Ex: Politician, activist, writer */
  title?: Maybe<Scalars['String']['output']>;
  /** List of speaker's videos */
  videos?: Maybe<Array<Maybe<Video>>>;
  /** Wikidata unique identifier, without the 'Q' prefix */
  wikidataItemId?: Maybe<Scalars['String']['output']>;
};

/** Reference to a removed speaker */
export type SpeakerRemoved = {
  __typename?: 'SpeakerRemoved';
  id: Scalars['ID']['output'];
};

/** A transcript or a description of the picture */
export type Statement = {
  __typename?: 'Statement';
  /** List of users comments and facts for this statement */
  comments?: Maybe<Array<Maybe<Comment>>>;
  id: Scalars['ID']['output'];
  /** Whether the statement is in draft mode */
  isDraft: Scalars['Boolean']['output'];
  /** Statement's speaker. Null if statement describes picture */
  speaker?: Maybe<Speaker>;
  /** Speaker's transcript or image description */
  text: Scalars['String']['output'];
  /** Statement timecode, in seconds */
  time: Scalars['Int']['output'];
  /** The video associated with this statement */
  video?: Maybe<Video>;
};

/** Props to filter statements on */
export type StatementFilter = {
  commented?: InputMaybe<Scalars['Boolean']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
  speakerId?: InputMaybe<Scalars['ID']['input']>;
};

/** Reference to a removed statement */
export type StatementRemoved = {
  __typename?: 'StatementRemoved';
  id: Scalars['ID']['output'];
};

/** Counts for all public CF tables */
export type StatisticTotals = {
  __typename?: 'StatisticTotals';
  comments: Scalars['Int']['output'];
  sources: Scalars['Int']['output'];
  statements: Scalars['Int']['output'];
  users: Scalars['Int']['output'];
};

/** Statistics about the platform community */
export type Statistics = {
  __typename?: 'Statistics';
  /** List the 20 best users */
  leaderboard?: Maybe<Array<Maybe<User>>>;
  /** All totals */
  totals?: Maybe<StatisticTotals>;
};

/** A user registered on the website */
export type User = {
  __typename?: 'User';
  /** A list of user's achievements as a list of integers */
  achievements?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  /** User activity log */
  actions?: Maybe<ActivityLog>;
  /** Actions pending moderation */
  actionsPendingModeration?: Maybe<Scalars['Int']['output']>;
  /** Unique user ID */
  id: Scalars['ID']['output'];
  /** Small version of the user picture (48x48) */
  miniPictureUrl: Scalars['String']['output'];
  /** Optional full-name */
  name?: Maybe<Scalars['String']['output']>;
  /** User notifications */
  notifications?: Maybe<PaginatedNotifications>;
  /** User picture url (96x96) */
  pictureUrl: Scalars['String']['output'];
  /** User's registration datetime */
  registeredAt: Scalars['NaiveDateTime']['output'];
  /** Reputation of the user. See https://captainfact.io/help/reputation */
  reputation?: Maybe<Scalars['Int']['output']>;
  /** User subscriptions */
  subscriptions?: Maybe<Array<Maybe<NotificationsSubscription>>>;
  /** User's reputation of the day. See https://captainfact.io/help/reputation */
  todayReputationGain?: Maybe<Scalars['Int']['output']>;
  /** Unique username */
  username: Scalars['String']['output'];
  /** A paginated list of videos added by this user */
  videosAdded?: Maybe<PaginatedVideos>;
  /** User's votes on comments as a map (commentId => vote value) */
  votes?: Maybe<Scalars['JSON']['output']>;
};


/** A user registered on the website */
export type UserActionsArgs = {
  direction?: InputMaybe<ActivityLogDirection>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** A user registered on the website */
export type UserNotificationsArgs = {
  filter?: InputMaybe<NotificationsFilter>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


/** A user registered on the website */
export type UserSubscriptionsArgs = {
  isSubscribed?: InputMaybe<Scalars['Boolean']['input']>;
  scopes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  videoId?: InputMaybe<Scalars['Int']['input']>;
};


/** A user registered on the website */
export type UserVideosAddedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** A user registered on the website */
export type UserVotesArgs = {
  videoHashId?: InputMaybe<Scalars['ID']['input']>;
  videoId?: InputMaybe<Scalars['ID']['input']>;
};

/** Describe a user action */
export type UserAction = {
  __typename?: 'UserAction';
  /** Reputation change for the author of the action */
  authorReputationChange?: Maybe<Scalars['Int']['output']>;
  /** A map with all the changes made by this action */
  changes?: Maybe<Scalars['String']['output']>;
  /** Associated comment */
  comment?: Maybe<Comment>;
  /** Comment impacted by this action */
  commentId?: Maybe<Scalars['Int']['output']>;
  /** Entity type */
  entity: Scalars['String']['output'];
  /** Unique action ID */
  id: Scalars['ID']['output'];
  /** Associated speaker */
  speaker?: Maybe<Speaker>;
  /** Speaker impacted by this action */
  speakerId?: Maybe<Scalars['Int']['output']>;
  /** Associated statement */
  statement?: Maybe<Statement>;
  /** Statement impacted by this action */
  statementId?: Maybe<Scalars['Int']['output']>;
  /** Reputation change for the target of the action */
  targetReputationChange?: Maybe<Scalars['Int']['output']>;
  /** User targeted by the action */
  targetUser?: Maybe<User>;
  /** Id of the User targeted by the action */
  targetUserId?: Maybe<Scalars['ID']['output']>;
  /** Datetime at which the action has been done */
  time?: Maybe<Scalars['String']['output']>;
  /** Action type */
  type: Scalars['String']['output'];
  /** User who made the action */
  user?: Maybe<User>;
  /** Id of the User who made the action */
  userId?: Maybe<Scalars['ID']['output']>;
  /** Associated video */
  video?: Maybe<Video>;
  /** Video hash ID where the action took place */
  videoHashId?: Maybe<Scalars['String']['output']>;
  /** Video ID where the action took place */
  videoId?: Maybe<Scalars['Int']['output']>;
};

/** Identifies a video. Only Youtube is supported at the moment */
export type Video = {
  __typename?: 'Video';
  /** Video captions */
  captions?: Maybe<Array<Maybe<VideoCaption>>>;
  /** Facebook ID for this video */
  facebookId?: Maybe<Scalars['String']['output']>;
  /** Offset for all statements on this video when watched with Facebook player */
  facebookOffset: Scalars['Int']['output'];
  /** Unique identifier as a hash (min length: 4) - used in URL */
  hashId: Scalars['String']['output'];
  /** Unique identifier as an integer */
  id: Scalars['ID']['output'];
  /** Video insert datetime */
  insertedAt: Scalars['NaiveDateTime']['output'];
  /** Define if video has been added by a partner or a regular user */
  isPartner?: Maybe<Scalars['Boolean']['output']>;
  /** Language of the video represented as a two letters locale */
  language?: Maybe<Scalars['String']['output']>;
  /**
   * Video provider (youtube, vimeo...etc)
   * @deprecated Use `url` or `youtube_id`
   */
  provider: Scalars['String']['output'];
  /**
   * Unique ID used to identify video with provider
   * @deprecated Use `url` or `youtube_id`
   */
  providerId: Scalars['String']['output'];
  /** List all non-removed speakers for this video */
  speakers?: Maybe<Array<Maybe<Speaker>>>;
  /** List all non-removed statements for this video ordered by time */
  statements?: Maybe<Array<Maybe<Statement>>>;
  /** Video thumbnail URL */
  thumbnail: Scalars['String']['output'];
  /** Video title as extracted from provider */
  title: Scalars['String']['output'];
  /** Define if video is unlisted */
  unlisted: Scalars['Boolean']['output'];
  /** Video URL */
  url: Scalars['String']['output'];
  /** Youtube ID for this video */
  youtubeId?: Maybe<Scalars['String']['output']>;
  /** Offset for all statements on this video when watched with YouTube player */
  youtubeOffset: Scalars['Int']['output'];
};

/** Information about the application */
export type VideoCaption = {
  __typename?: 'VideoCaption';
  /** Caption duration (in seconds) */
  duration?: Maybe<Scalars['Float']['output']>;
  /** Caption start time (in seconds) */
  start: Scalars['Float']['output'];
  /** Caption text */
  text: Scalars['String']['output'];
};

/** Props to filter videos on */
export type VideoFilter = {
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  isPartner?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  minId?: InputMaybe<Scalars['ID']['input']>;
  speakerId?: InputMaybe<Scalars['ID']['input']>;
  speakerSlug?: InputMaybe<Scalars['String']['input']>;
};

export type VideosIndexQueryVariables = Exact<{
  offset?: Scalars['Int']['input'];
  limit?: Scalars['Int']['input'];
  filters?: InputMaybe<VideoFilter>;
}>;


export type VideosIndexQuery = (
  { videos?: (
    { pageNumber?: number | null, totalPages?: number | null, entries?: Array<(
      { id: string, hashId: string, youtubeId?: string | null, title: string, insertedAt: string, isPartner?: boolean | null, thumbnail: string, speakers?: Array<(
        { fullName: string, id: string, slug?: string | null }
        & { __typename?: 'Speaker' }
      ) | null> | null }
      & { __typename?: 'Video' }
    ) | null> | null }
    & { __typename?: 'PaginatedVideos' }
  ) | null }
  & { __typename?: 'RootQueryType' }
);

export type UserQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type UserQuery = (
  { user?: (
    { id: string, username: string, name?: string | null, reputation?: number | null, registeredAt: string, pictureUrl: string, miniPictureUrl: string, achievements?: Array<number | null> | null }
    & { __typename?: 'User' }
  ) | null }
  & { __typename?: 'RootQueryType' }
);

export type UserAddedVideosIndexQueryVariables = Exact<{
  offset?: Scalars['Int']['input'];
  limit?: Scalars['Int']['input'];
  username: Scalars['String']['input'];
}>;


export type UserAddedVideosIndexQuery = (
  { user?: (
    { id: string, videosAdded?: (
      { pageNumber?: number | null, totalPages?: number | null, entries?: Array<(
        { id: string, hashId: string, youtubeId?: string | null, title: string, insertedAt: string, isPartner?: boolean | null, thumbnail: string, speakers?: Array<(
          { fullName: string, id: string, slug?: string | null }
          & { __typename?: 'Speaker' }
        ) | null> | null }
        & { __typename?: 'Video' }
      ) | null> | null }
      & { __typename?: 'PaginatedVideos' }
    ) | null }
    & { __typename?: 'User' }
  ) | null }
  & { __typename?: 'RootQueryType' }
);

export type LoggedInUserSubscriptionsQueryVariables = Exact<{
  scopes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
}>;


export type LoggedInUserSubscriptionsQuery = (
  { loggedInUser?: (
    { id: string, subscriptions?: Array<(
      { id: string, scope: string, videoId?: number | null, isSubscribed: boolean, video?: (
        { hashId: string, title: string }
        & { __typename?: 'Video' }
      ) | null }
      & { __typename?: 'NotificationsSubscription' }
    ) | null> | null }
    & { __typename?: 'User' }
  ) | null }
  & { __typename?: 'RootQueryType' }
);

export type LoggedInUserUnreadNotificationsCountQueryVariables = Exact<{ [key: string]: never; }>;


export type LoggedInUserUnreadNotificationsCountQuery = (
  { loggedInUser?: (
    { id: string, notifications?: (
      { totalEntries?: number | null }
      & { __typename?: 'PaginatedNotifications' }
    ) | null }
    & { __typename?: 'User' }
  ) | null }
  & { __typename?: 'RootQueryType' }
);

export type LoggedInUserUnreadNotificationsCountQueryVariables = Exact<{ [key: string]: never; }>;


export type LoggedInUserUnreadNotificationsCountQuery = (
  { loggedInUser?: (
    { id: string, actionsPendingModeration?: number | null }
    & { __typename?: 'User' }
  ) | null }
  & { __typename?: 'RootQueryType' }
);

export type LoggedInUserTodayReputationGainQueryVariables = Exact<{ [key: string]: never; }>;


export type LoggedInUserTodayReputationGainQuery = (
  { loggedInUser?: (
    { id: string, todayReputationGain?: number | null }
    & { __typename?: 'User' }
  ) | null }
  & { __typename?: 'RootQueryType' }
);

export type VideoDebateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type VideoDebateQuery = (
  { video?: (
    { id: string, hashId: string, title: string, url: string, thumbnail: string, language?: string | null, unlisted: boolean, youtubeOffset: number, speakers?: Array<(
      { id: string, fullName: string, slug?: string | null, picture?: string | null }
      & { __typename?: 'Speaker' }
    ) | null> | null, statements?: Array<(
      { id: string, text: string, time: number, isDraft: boolean, speaker?: (
        { id: string, fullName: string, picture?: string | null }
        & { __typename?: 'Speaker' }
      ) | null, comments?: Array<(
        { id: string, text?: string | null, approve?: boolean | null, score: number, insertedAt: string, replyToId?: string | null, user?: (
          { id: string, username: string, pictureUrl: string }
          & { __typename?: 'User' }
        ) | null, source?: (
          { id: string, url: string }
          & { __typename?: 'Source' }
        ) | null }
        & { __typename?: 'Comment' }
      ) | null> | null }
      & { __typename?: 'Statement' }
    ) | null> | null }
    & { __typename?: 'Video' }
  ) | null }
  & { __typename?: 'RootQueryType' }
);

export type DeleteStatementMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteStatementMutation = (
  { deleteStatement?: (
    { id: string }
    & { __typename?: 'StatementRemoved' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type UpdateStatementMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<Scalars['Int']['input']>;
  speakerId?: InputMaybe<Scalars['ID']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateStatementMutation = (
  { updateStatement?: (
    { id: string, time: number, text: string, isDraft: boolean, speaker?: (
      { id: string }
      & { __typename?: 'Speaker' }
    ) | null, video?: (
      { id: string }
      & { __typename?: 'Video' }
    ) | null }
    & { __typename?: 'Statement' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type CreateCommentMutationVariables = Exact<{
  statementId: Scalars['ID']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  replyToId?: InputMaybe<Scalars['ID']['input']>;
  approve?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreateCommentMutation = (
  { createComment?: (
    { id: string, text?: string | null, approve?: boolean | null, insertedAt: string, replyToId?: string | null, statementId?: string | null, user?: (
      { id: string, username: string, pictureUrl: string }
      & { __typename?: 'User' }
    ) | null, source?: (
      { id: string, url: string }
      & { __typename?: 'Source' }
    ) | null }
    & { __typename?: 'Comment' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCommentMutation = (
  { deleteComment?: (
    { id: string, statementId?: string | null, replyToId?: string | null }
    & { __typename?: 'CommentRemoved' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type VoteCommentMutationVariables = Exact<{
  commentId: Scalars['ID']['input'];
  value: Scalars['Int']['input'];
}>;


export type VoteCommentMutation = (
  { voteComment?: (
    { id: string, score: number }
    & { __typename?: 'Comment' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type FlagCommentMutationVariables = Exact<{
  commentId: Scalars['ID']['input'];
  reason: Scalars['Int']['input'];
}>;


export type FlagCommentMutation = (
  { flagComment?: (
    { id: string }
    & { __typename?: 'CommentFlagged' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type SearchSpeakersQueryVariables = Exact<{
  query: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchSpeakersQuery = (
  { searchSpeakers?: Array<(
    { id: string, fullName: string, slug?: string | null, picture?: string | null }
    & { __typename?: 'Speaker' }
  ) | null> | null }
  & { __typename?: 'RootQueryType' }
);

export type AddSpeakerToVideoMutationVariables = Exact<{
  videoId: Scalars['ID']['input'];
  speakerId: Scalars['ID']['input'];
}>;


export type AddSpeakerToVideoMutation = (
  { addSpeakerToVideo?: (
    { id: string, fullName: string, slug?: string | null, picture?: string | null }
    & { __typename?: 'Speaker' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type CreateSpeakerMutationVariables = Exact<{
  videoId: Scalars['ID']['input'];
  fullName: Scalars['String']['input'];
}>;


export type CreateSpeakerMutation = (
  { createSpeaker?: (
    { id: string, fullName: string, slug?: string | null, picture?: string | null }
    & { __typename?: 'Speaker' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type RemoveSpeakerFromVideoMutationVariables = Exact<{
  videoId: Scalars['ID']['input'];
  speakerId: Scalars['ID']['input'];
}>;


export type RemoveSpeakerFromVideoMutation = (
  { removeSpeakerFromVideo?: (
    { id: string }
    & { __typename?: 'SpeakerRemoved' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type UpdateSpeakerMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  fullName?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  wikidataItemId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateSpeakerMutation = (
  { updateSpeaker?: (
    { id: string, fullName: string, title?: string | null, wikidataItemId?: string | null, picture?: string | null, slug?: string | null }
    & { __typename?: 'Speaker' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type RestoreStatementMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RestoreStatementMutation = (
  { restoreStatement?: (
    { id: string, text: string, time: number, isDraft: boolean, speaker?: (
      { id: string, fullName: string, picture?: string | null }
      & { __typename?: 'Speaker' }
    ) | null, video?: (
      { id: string }
      & { __typename?: 'Video' }
    ) | null }
    & { __typename?: 'Statement' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type RestoreSpeakerMutationVariables = Exact<{
  speakerId: Scalars['ID']['input'];
  videoId: Scalars['ID']['input'];
}>;


export type RestoreSpeakerMutation = (
  { restoreSpeaker?: (
    { id: string, fullName: string, slug?: string | null, picture?: string | null }
    & { __typename?: 'Speaker' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type SpeakerQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type SpeakerQuery = (
  { speaker?: (
    { id: string, slug?: string | null, fullName: string, title?: string | null, wikidataItemId?: string | null, picture?: string | null, videos?: Array<(
      { id: string, hashId: string, title: string, thumbnail: string, insertedAt: string, isPartner?: boolean | null }
      & { __typename?: 'Video' }
    ) | null> | null }
    & { __typename?: 'Speaker' }
  ) | null }
  & { __typename?: 'RootQueryType' }
);

export type VideoHistoryActionsQueryVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type VideoHistoryActionsQuery = (
  { videoHistoryActions?: Array<(
    { id: string, type: string, entity: string, changes?: string | null, time?: string | null, speakerId?: number | null, statementId?: number | null, commentId?: number | null, videoId?: number | null, videoHashId?: string | null, user?: (
      { id: string, username: string, name?: string | null, pictureUrl: string, miniPictureUrl: string }
      & { __typename?: 'User' }
    ) | null }
    & { __typename?: 'UserAction' }
  ) | null> | null }
  & { __typename?: 'RootQueryType' }
);

export type VideoHistoryActionAddedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type VideoHistoryActionAddedSubscription = (
  { videoHistoryActionAdded?: (
    { id: string, type: string, entity: string, changes?: string | null, time?: string | null, speakerId?: number | null, statementId?: number | null, commentId?: number | null, videoId?: number | null, videoHashId?: string | null, user?: (
      { id: string, username: string, name?: string | null, pictureUrl: string, miniPictureUrl: string }
      & { __typename?: 'User' }
    ) | null }
    & { __typename?: 'UserAction' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type StatementAddedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type StatementAddedSubscription = (
  { statementAdded?: (
    { id: string, time: number, text: string, isDraft: boolean, speaker?: (
      { id: string, fullName: string, picture?: string | null }
      & { __typename?: 'Speaker' }
    ) | null, video?: (
      { id: string }
      & { __typename?: 'Video' }
    ) | null }
    & { __typename?: 'Statement' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type StatementUpdatedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type StatementUpdatedSubscription = (
  { statementUpdated?: (
    { id: string, time: number, text: string, isDraft: boolean, speaker?: (
      { id: string, fullName: string, picture?: string | null }
      & { __typename?: 'Speaker' }
    ) | null, video?: (
      { id: string }
      & { __typename?: 'Video' }
    ) | null }
    & { __typename?: 'Statement' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type StatementRemovedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type StatementRemovedSubscription = (
  { statementRemoved?: (
    { id: string }
    & { __typename?: 'StatementRemoved' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type CommentAddedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type CommentAddedSubscription = (
  { commentAdded?: (
    { id: string, text?: string | null, approve?: boolean | null, score: number, insertedAt: string, replyToId?: string | null, statementId?: string | null, user?: (
      { id: string, username: string, pictureUrl: string }
      & { __typename?: 'User' }
    ) | null, source?: (
      { id: string, url: string }
      & { __typename?: 'Source' }
    ) | null }
    & { __typename?: 'Comment' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type CommentUpdatedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type CommentUpdatedSubscription = (
  { commentUpdated?: (
    { id: string, text?: string | null, approve?: boolean | null, score: number, insertedAt: string, replyToId?: string | null, statementId?: string | null, user?: (
      { id: string, username: string, pictureUrl: string }
      & { __typename?: 'User' }
    ) | null, source?: (
      { id: string, url: string }
      & { __typename?: 'Source' }
    ) | null }
    & { __typename?: 'Comment' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type CommentRemovedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type CommentRemovedSubscription = (
  { commentRemoved?: (
    { id: string, statementId?: string | null, replyToId?: string | null }
    & { __typename?: 'CommentRemoved' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type CommentScoreDiffSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type CommentScoreDiffSubscription = (
  { commentScoreDiff?: (
    { diff: number, comment: (
      { id: string, statementId?: string | null, replyToId?: string | null }
      & { __typename?: 'CommentReference' }
    ) }
    & { __typename?: 'CommentScoreDiff' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type StatementAddedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type StatementAddedSubscription = (
  { statementAdded?: (
    { id: string, time: number, text: string, isDraft: boolean, video?: (
      { id: string }
      & { __typename?: 'Video' }
    ) | null }
    & { __typename?: 'Statement' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type CommentAddedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type CommentAddedSubscription = (
  { commentAdded?: (
    { id: string, text?: string | null, replyToId?: string | null, score: number }
    & { __typename?: 'Comment' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type CommentScoreDiffSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type CommentScoreDiffSubscription = (
  { commentScoreDiff?: (
    { diff: number, comment: (
      { id: string, statementId?: string | null, replyToId?: string | null }
      & { __typename?: 'CommentReference' }
    ) }
    & { __typename?: 'CommentScoreDiff' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type StatementRemovedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type StatementRemovedSubscription = (
  { statementRemoved?: (
    { id: string }
    & { __typename?: 'StatementRemoved' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type CommentRemovedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type CommentRemovedSubscription = (
  { commentRemoved?: (
    { id: string, statementId?: string | null, replyToId?: string | null }
    & { __typename?: 'CommentRemoved' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type CreateStatementMutationVariables = Exact<{
  videoId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
  time: Scalars['Int']['input'];
  speakerId?: InputMaybe<Scalars['ID']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreateStatementMutation = (
  { createStatement?: (
    { id: string, time: number, text: string, isDraft: boolean, video?: (
      { id: string }
      & { __typename?: 'Video' }
    ) | null }
    & { __typename?: 'Statement' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type LoggedInUserNotificationsQueryVariables = Exact<{
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
  filter?: InputMaybe<NotificationsFilter>;
}>;


export type LoggedInUserNotificationsQuery = (
  { loggedInUser?: (
    { id: string, notifications?: (
      { pageNumber?: number | null, pageSize?: number | null, totalEntries?: number | null, totalPages?: number | null, entries?: Array<(
        { id: string, seenAt?: string | null, insertedAt: string, type: string, action?: (
          { entity: string, type: string, speakerId?: number | null, statementId?: number | null, commentId?: number | null, changes?: string | null, user?: (
            { id: string, name?: string | null, username: string }
            & { __typename?: 'User' }
          ) | null, video?: (
            { id: string, hashId: string, title: string }
            & { __typename?: 'Video' }
          ) | null, speaker?: (
            { id: string, slug?: string | null, fullName: string }
            & { __typename?: 'Speaker' }
          ) | null, comment?: (
            { id: string, text?: string | null }
            & { __typename?: 'Comment' }
          ) | null }
          & { __typename?: 'UserAction' }
        ) | null }
        & { __typename?: 'Notification' }
      ) | null> | null }
      & { __typename?: 'PaginatedNotifications' }
    ) | null }
    & { __typename?: 'User' }
  ) | null }
  & { __typename?: 'RootQueryType' }
);

export type UpdateNotificationMutationVariables = Exact<{
  ids: Array<InputMaybe<Scalars['ID']['input']>> | InputMaybe<Scalars['ID']['input']>;
  seen: Scalars['Boolean']['input'];
}>;


export type UpdateNotificationMutation = (
  { updateNotifications?: Array<(
    { id: string, seenAt?: string | null }
    & { __typename?: 'Notification' }
  ) | null> | null }
  & { __typename?: 'RootMutationType' }
);

export type UpdateSubscriptionMutationVariables = Exact<{
  entityId: Scalars['ID']['input'];
  scope: Scalars['String']['input'];
  isSubscribed: Scalars['Boolean']['input'];
}>;


export type UpdateSubscriptionMutation = (
  { updateSubscription?: (
    { id: string, isSubscribed: boolean, reason?: string | null }
    & { __typename?: 'NotificationsSubscription' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type CreateStatementMutationVariables = Exact<{
  videoId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
  time: Scalars['Int']['input'];
  speakerId?: InputMaybe<Scalars['ID']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreateStatementMutation = (
  { createStatement?: (
    { id: string, time: number, text: string, isDraft: boolean, video?: (
      { id: string }
      & { __typename?: 'Video' }
    ) | null }
    & { __typename?: 'Statement' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type UpdateStatementMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<Scalars['Int']['input']>;
  speakerId?: InputMaybe<Scalars['ID']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateStatementMutation = (
  { updateStatement?: (
    { id: string, time: number, text: string, isDraft: boolean, speaker?: (
      { id: string }
      & { __typename?: 'Speaker' }
    ) | null, video?: (
      { id: string }
      & { __typename?: 'Video' }
    ) | null }
    & { __typename?: 'Statement' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type UserActivityLogQueryVariables = Exact<{
  username: Scalars['String']['input'];
  offset: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  direction: ActivityLogDirection;
}>;


export type UserActivityLogQuery = (
  { user?: (
    { id: string, username: string, name?: string | null, actions?: (
      { pageNumber?: number | null, totalPages?: number | null, entries?: Array<(
        { id: string, type: string, entity: string, time?: string | null, changes?: string | null, videoHashId?: string | null, statementId?: number | null, commentId?: number | null, speakerId?: number | null, authorReputationChange?: number | null, targetReputationChange?: number | null, userId?: string | null, targetUserId?: string | null, user?: (
          { id: string, username: string, name?: string | null }
          & { __typename?: 'User' }
        ) | null, targetUser?: (
          { id: string, username: string, name?: string | null }
          & { __typename?: 'User' }
        ) | null }
        & { __typename?: 'UserAction' }
      ) | null> | null }
      & { __typename?: 'ActivityLog' }
    ) | null }
    & { __typename?: 'User' }
  ) | null }
  & { __typename?: 'RootQueryType' }
);

export type StartAutomaticStatementsExtractionMutationVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type StartAutomaticStatementsExtractionMutation = (
  { startAutomaticStatementsExtraction?: (
    { id: string }
    & { __typename?: 'Video' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type VideoCaptionsQueryVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type VideoCaptionsQuery = (
  { video?: (
    { id: string, captions?: Array<(
      { text: string, start: number, duration?: number | null }
      & { __typename?: 'VideoCaption' }
    ) | null> | null }
    & { __typename?: 'Video' }
  ) | null }
  & { __typename?: 'RootQueryType' }
);

export type StartAutomaticStatementsExtractionMutationVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type StartAutomaticStatementsExtractionMutation = (
  { startAutomaticStatementsExtraction?: (
    { id: string }
    & { __typename?: 'Video' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type UpdateSubscriptionMutationVariables = Exact<{
  entityId: Scalars['ID']['input'];
  scope: Scalars['String']['input'];
  isSubscribed: Scalars['Boolean']['input'];
}>;


export type UpdateSubscriptionMutation = (
  { updateSubscription?: (
    { id: string, isSubscribed: boolean }
    & { __typename?: 'NotificationsSubscription' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);

export type CommentFieldsFragment = (
  { id: string, text?: string | null, approve?: boolean | null, score: number, insertedAt: string, replyToId?: string | null, statementId?: string | null, user?: (
    { id: string, username: string, pictureUrl: string, miniPictureUrl: string }
    & { __typename?: 'User' }
  ) | null, source?: (
    { id: string, url: string }
    & { __typename?: 'Source' }
  ) | null }
  & { __typename?: 'Comment' }
);

export type StatementFieldsFragment = (
  { id: string, text: string, time: number, isDraft: boolean, speaker?: (
    { id: string, fullName: string, picture?: string | null }
    & { __typename?: 'Speaker' }
  ) | null, comments?: Array<(
    { id: string, text?: string | null, approve?: boolean | null, score: number, insertedAt: string, replyToId?: string | null, statementId?: string | null, user?: (
      { id: string, username: string, pictureUrl: string, miniPictureUrl: string }
      & { __typename?: 'User' }
    ) | null, source?: (
      { id: string, url: string }
      & { __typename?: 'Source' }
    ) | null }
    & { __typename?: 'Comment' }
  ) | null> | null }
  & { __typename?: 'Statement' }
);

export type VideoDebateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type VideoDebateQuery = (
  { video?: (
    { id: string, hashId: string, title: string, url: string, thumbnail: string, language?: string | null, unlisted: boolean, youtubeOffset: number, speakers?: Array<(
      { id: string, fullName: string, title?: string | null, wikidataItemId?: string | null, slug?: string | null, picture?: string | null }
      & { __typename?: 'Speaker' }
    ) | null> | null, statements?: Array<(
      { id: string, text: string, time: number, isDraft: boolean, speaker?: (
        { id: string, fullName: string, picture?: string | null }
        & { __typename?: 'Speaker' }
      ) | null, comments?: Array<(
        { id: string, text?: string | null, approve?: boolean | null, score: number, insertedAt: string, replyToId?: string | null, statementId?: string | null, user?: (
          { id: string, username: string, pictureUrl: string, miniPictureUrl: string }
          & { __typename?: 'User' }
        ) | null, source?: (
          { id: string, url: string }
          & { __typename?: 'Source' }
        ) | null }
        & { __typename?: 'Comment' }
      ) | null> | null }
      & { __typename?: 'Statement' }
    ) | null> | null }
    & { __typename?: 'Video' }
  ) | null, loggedInUser?: (
    { id: string, votes?: any | null }
    & { __typename?: 'User' }
  ) | null }
  & { __typename?: 'RootQueryType' }
);

export type StatementAddedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type StatementAddedSubscription = (
  { statementAdded?: (
    { id: string, text: string, time: number, isDraft: boolean, video?: (
      { id: string }
      & { __typename?: 'Video' }
    ) | null, speaker?: (
      { id: string, fullName: string, picture?: string | null }
      & { __typename?: 'Speaker' }
    ) | null, comments?: Array<(
      { id: string, text?: string | null, approve?: boolean | null, score: number, insertedAt: string, replyToId?: string | null, statementId?: string | null, user?: (
        { id: string, username: string, pictureUrl: string, miniPictureUrl: string }
        & { __typename?: 'User' }
      ) | null, source?: (
        { id: string, url: string }
        & { __typename?: 'Source' }
      ) | null }
      & { __typename?: 'Comment' }
    ) | null> | null }
    & { __typename?: 'Statement' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type StatementRemovedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type StatementRemovedSubscription = (
  { statementRemoved?: (
    { id: string }
    & { __typename?: 'StatementRemoved' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type CommentAddedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type CommentAddedSubscription = (
  { commentAdded?: (
    { id: string, text?: string | null, approve?: boolean | null, score: number, insertedAt: string, replyToId?: string | null, statementId?: string | null, user?: (
      { id: string, username: string, pictureUrl: string, miniPictureUrl: string }
      & { __typename?: 'User' }
    ) | null, source?: (
      { id: string, url: string }
      & { __typename?: 'Source' }
    ) | null }
    & { __typename?: 'Comment' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type CommentRemovedSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type CommentRemovedSubscription = (
  { commentRemoved?: (
    { id: string, statementId?: string | null, replyToId?: string | null }
    & { __typename?: 'CommentRemoved' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type CommentScoreDiffSubscriptionVariables = Exact<{
  videoId: Scalars['ID']['input'];
}>;


export type CommentScoreDiffSubscription = (
  { commentScoreDiff?: (
    { diff: number, comment: (
      { id: string, statementId?: string | null, replyToId?: string | null }
      & { __typename?: 'CommentReference' }
    ) }
    & { __typename?: 'CommentScoreDiff' }
  ) | null }
  & { __typename?: 'RootSubscriptionType' }
);

export type EditVideoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  unlisted: Scalars['Boolean']['input'];
}>;


export type EditVideoMutation = (
  { editVideo?: (
    { id: string, unlisted: boolean }
    & { __typename?: 'Video' }
  ) | null }
  & { __typename?: 'RootMutationType' }
);
