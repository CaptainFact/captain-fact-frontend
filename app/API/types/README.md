# GraphQL TypeScript Types

This directory contains auto-generated TypeScript types for the GraphQL schema, queries, mutations, and subscriptions.

## Generated Files

- `generated.ts` - Contains all TypeScript types, query/mutation types, and operation result types

## Regenerating Types

To regenerate types after schema changes or when adding new queries/mutations:

```bash
npm run generate:types
```

For watch mode (automatically regenerates on file changes):

```bash
npm run generate:types:watch
```

## When to Regenerate

You should regenerate types when:

1. The GraphQL schema has been updated (new types, fields, queries, mutations, or subscriptions)
2. You've added new GraphQL queries, mutations, or subscriptions to the codebase
3. You've modified existing GraphQL operations

## Using Generated Types

### Import Types

```typescript
import type {
  Video,
  Statement,
  Comment,
  VideosQuery,
  VideosQueryVariables,
  CreateCommentMutation,
  CreateCommentMutationVariables,
} from './types/generated'
```

### Use with Apollo Client

```typescript
import { useQuery } from '@apollo/client'
import { VideosQuery, VideosQueryVariables } from '../API/types/generated'
import { VideosQuery as VideosQueryDocument } from '../API/graphql_queries'

const { data, loading, error } = useQuery<VideosQuery, VideosQueryVariables>(VideosQueryDocument, {
  variables: { offset: 1, limit: 10 },
})
```

### Type-Safe Query Results

The generated types ensure type safety for:

- Query variables
- Query results
- Mutation variables
- Mutation results
- Subscription payloads

## Configuration

The codegen configuration is in `codegen.yml` at the project root. The schema URL can be configured via the `GRAPHQL_API_URL` environment variable (defaults to `http://localhost:4002`).

## Notes

- The generated file is automatically created and should be committed to version control
- Never manually edit `generated.ts` - it will be overwritten on regeneration
- If you need custom types, create them in separate files and import alongside the generated types
