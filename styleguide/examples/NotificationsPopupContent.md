### Empty state

```js
<div style={{ maxWidth: 400, border: '1px solid lightgrey' }}>
  <NotificationsPopupContent notifications={[]} />
</div>
```

### With different notifications types

```js
<div style={{ maxWidth: 400, border: '1px solid lightgrey' }}>
  <NotificationsPopupContent
    notifications={[
      {
        type: 'new_comment',
        seenAt: null,
        insertedAt: '2019-01-13 15:41:06.011372',
        id: '1',
        action: {
          video: {
            title: 'Mounir Mahjoubi, Ministre chargé du Numérique [EN DIRECT]',
            hashId: 'Jzqg',
            __typename: 'Video'
          },
          user: { username: 'Basile', name: null, __typename: 'User' },
          statementId: 42,
          speakerId: null,
          entity: 'comment',
          commentId: 1956,
          __typename: 'UserAction'
        },
        __typename: 'Notification'
      }
    ]}
    user={{ username: 'toto' }}
  />
</div>
```
