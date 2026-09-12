# Database schema

See `services/api/migrations/001_init.sql` for the executable MVP schema.

```mermaid
erDiagram
 users ||--|| profiles : has
 users ||--o{ devices : owns
 users ||--o{ consents : grants
 users ||--o{ presence_sessions : starts
 users ||--o{ music_selections : shares
 presence_sessions ||--o{ proximity_encounters : observes
 users ||--o{ match_candidates : participates
 match_candidates ||--o| connections : becomes
 connections ||--|| conversations : opens
 conversations ||--o{ messages : contains
 users ||--o{ blocks : creates
 users ||--o{ reports : files
```

Hot queries are indexed by active presence expiry, candidate user/status/expiry, connection participant/state, conversation cursor, and moderation status. UUIDs prevent sequence enumeration. Message bodies are separate from analytics. Raw BLE tokens are HMAC-indexed and TTL-only in Redis, not durable rows.
