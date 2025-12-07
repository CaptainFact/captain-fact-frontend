import { useMutation, useSubscription } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ScrollArea } from '../ui/scroll-area'

// GraphQL subscription queries
// Note: Absinthe converts snake_case schema fields to camelCase in GraphQL queries
const STATEMENT_ADDED_SUBSCRIPTION = gql`
  subscription StatementAdded($videoId: ID!) {
    statementAdded(videoId: $videoId) {
      id
      time
      text
      isDraft
      video {
        id
      }
    }
  }
`

const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription CommentAdded($videoId: ID!) {
    commentAdded(videoId: $videoId) {
      id
      text
      replyToId
      score
    }
  }
`

const COMMENT_SCORE_DIFF_SUBSCRIPTION = gql`
  subscription CommentScoreDiff($videoId: ID!) {
    commentScoreDiff(videoId: $videoId) {
      comment {
        id
        statementId
        replyToId
      }
      diff
    }
  }
`

const STATEMENT_REMOVED_SUBSCRIPTION = gql`
  subscription StatementRemoved($videoId: ID!) {
    statementRemoved(videoId: $videoId) {
      id
    }
  }
`

const COMMENT_REMOVED_SUBSCRIPTION = gql`
  subscription CommentRemoved($videoId: ID!) {
    commentRemoved(videoId: $videoId) {
      id
      statementId
      replyToId
    }
  }
`

const CREATE_STATEMENT_MUTATION = gql`
  mutation CreateStatement($videoId: ID!, $text: String!, $time: Int!, $speakerId: ID, $isDraft: Boolean) {
    createStatement(videoId: $videoId, text: $text, time: $time, speakerId: $speakerId, isDraft: $isDraft) {
      id
      time
      text
      isDraft
      video {
        id
      }
    }
  }
`

const SubscriptionPOC = () => {
  const [videoId, setVideoId] = useState('1')
  const [events, setEvents] = useState([])
  const [isCreatingStatement, setIsCreatingStatement] = useState(false)

  // Subscribe to various events
  const { data: statementAddedData } = useSubscription(STATEMENT_ADDED_SUBSCRIPTION, {
    variables: { videoId },
    skip: !videoId,
  })

  const { data: commentAddedData } = useSubscription(COMMENT_ADDED_SUBSCRIPTION, {
    variables: { videoId },
    skip: !videoId,
  })

  const { data: commentScoreDiffData } = useSubscription(COMMENT_SCORE_DIFF_SUBSCRIPTION, {
    variables: { videoId },
    skip: !videoId,
  })

  const { data: statementRemovedData } = useSubscription(STATEMENT_REMOVED_SUBSCRIPTION, {
    variables: { videoId },
    skip: !videoId,
  })

  const { data: commentRemovedData } = useSubscription(COMMENT_REMOVED_SUBSCRIPTION, {
    variables: { videoId },
    skip: !videoId,
  })

  const [createStatement] = useMutation(CREATE_STATEMENT_MUTATION)

  // Handle subscription data updates
  useEffect(() => {
    if (statementAddedData?.statementAdded) {
      addEvent('statement_added', statementAddedData.statementAdded)
    }
  }, [statementAddedData])

  useEffect(() => {
    if (commentAddedData?.commentAdded) {
      addEvent('comment_added', commentAddedData.commentAdded)
    }
  }, [commentAddedData])

  useEffect(() => {
    if (commentScoreDiffData?.commentScoreDiff) {
      addEvent('comment_score_diff', commentScoreDiffData.commentScoreDiff)
    }
  }, [commentScoreDiffData])

  useEffect(() => {
    if (statementRemovedData?.statementRemoved) {
      addEvent('statement_removed', statementRemovedData.statementRemoved)
    }
  }, [statementRemovedData])

  useEffect(() => {
    if (commentRemovedData?.commentRemoved) {
      addEvent('comment_removed', commentRemovedData.commentRemoved)
    }
  }, [commentRemovedData])

  const addEvent = (eventType, payload) => {
    const newEvent = {
      id: Date.now() + Math.random(),
      type: eventType,
      timestamp: new Date().toISOString(),
      payload,
    }
    setEvents((prev) => [newEvent, ...prev])
  }

  const clearEvents = () => {
    setEvents([])
  }

  const createDummyStatement = async () => {
    if (!videoId) {
      alert('Please enter a video ID')
      return
    }

    setIsCreatingStatement(true)
    try {
      const result = await createStatement({
        variables: {
          videoId: videoId,
          text: `Dummy statement created at ${new Date().toLocaleTimeString()}`,
          time: Math.floor(Math.random() * 3600), // Random time between 0-3600 seconds
          speakerId: null, // Can be set if you have a speaker ID
          isDraft: false,
        },
      })

      // The GraphQL subscription will automatically pick this up
      console.log('Statement created:', result.data?.createStatement)
    } catch (error) {
      console.error('Failed to create statement:', error)
      alert(`Failed to create statement: ${error.message || error}`)
    } finally {
      setIsCreatingStatement(false)
    }
  }

  const getEventTypeColor = (type) => {
    const colors = {
      statement_added: 'bg-blue-500',
      statement_removed: 'bg-red-500',
      comment_added: 'bg-green-500',
      comment_removed: 'bg-orange-500',
      comment_score_diff: 'bg-purple-500',
    }
    return colors[type] || 'bg-gray-500'
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>GraphQL Subscription POC</CardTitle>
            <CardDescription>Listen to GraphQL subscription events in real-time</CardDescription>
          </div>
          <Button onClick={clearEvents} variant="outline">
            Clear Events
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label htmlFor="videoId">Video ID:</Label>
            <Input
              id="videoId"
              type="text"
              value={videoId}
              onChange={(e) => {
                setVideoId(e.target.value)
              }}
              className="w-32"
              placeholder="1"
            />
          </div>
          <Button
            onClick={createDummyStatement}
            disabled={isCreatingStatement || !videoId}
            variant="default"
          >
            {isCreatingStatement ? 'Creating...' : 'Create Dummy Statement'}
          </Button>
        </div>
      </CardContent>
      <CardContent className="pt-0">
        <div className="mb-4">
          <Badge variant="secondary" className="mr-2">
            Total Events: {events.length}
          </Badge>
          <Badge variant="outline" className="mr-2">
            Statement Added: {events.filter((e) => e.type === 'statement_added').length}
          </Badge>
          <Badge variant="outline" className="mr-2">
            Comment Added: {events.filter((e) => e.type === 'comment_added').length}
          </Badge>
          <Badge variant="outline">
            Score Diff: {events.filter((e) => e.type === 'comment_score_diff').length}
          </Badge>
        </div>
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
          {events.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No events received yet. Events will appear here when they are published.
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="border-l-4"
                  style={{ borderLeftColor: 'var(--color-primary)' }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default SubscriptionPOC
