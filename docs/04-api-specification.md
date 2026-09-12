# API specification

The canonical machine-readable contract is `openapi.yaml`. All routes are `/api/v1`, TLS-only, JSON, authenticated unless marked, idempotency-key aware for transitions, and return RFC 9457-style problems.

| Route | Auth / limit | Purpose / key errors |
|---|---|---|
| `POST /auth/register` | invite; 5/IP/h | adult registration; invalid invite, age, conflict |
| `POST /auth/refresh` | refresh token; 20/device/h | rotate session; reuse revokes family |
| `GET/PATCH /me` | user; 60/min | profile/privacy with field validation |
| `POST /music/selection` | user; 30/min | normalize manual/provider track |
| `POST /discovery/sessions` | user/device; 6/h | issue 15-min session and token |
| `DELETE /discovery/sessions/{id}` | owner; 20/min | pause, idempotent |
| `POST /discovery/encounters` | active session; 120/min | opaque encounter; replay/expired/risk |
| `GET /matches` | user; 30/min | authorized non-expired candidate page |
| `POST /connections/{candidateId}/request` | candidate owner; 10/h | request; duplicate/blocked/expired |
| `POST /connections/{id}/accept` | recipient; 20/h | mutual transition |
| `GET/POST /conversations/{id}/messages` | connected; 60/30 min | cursor read/send; blocked/length |
| `POST /safety/blocks` | user; 30/h | atomic block and visibility removal |
| `POST /safety/reports` | user; 10/h | scoped evidence and moderation case |
| `POST /account/export` | user; 2/day | asynchronous export job |
| `DELETE /account` | recent auth; 2/day | revoke and erasure workflow |

WebSocket authenticates once, resumes from monotonic cursor, sends heartbeats and supports `match.created`, `connection.requested`, `connection.accepted`, `message.created`, `message.read`, and `discovery.expired`. Clients dedupe by event ID and REST-sync after cursor expiry.
