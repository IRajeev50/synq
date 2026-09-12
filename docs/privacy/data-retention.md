# Data retention schedule

| Data | Why | Default retention | Access/deletion |
|---|---|---|---|
| Account/profile | identity and connection | account life; erase within 30 days after deletion | user, support-minimal |
| Consent ledger | prove choices/policy | account life + legally required period | privacy/admin audit |
| Provider refresh token | optional integration | until revoke/disconnect; encrypted | integration worker only |
| Current music selection | explain active match | 24 hours unless saved to profile | user and match engine |
| Presence/token map | active discovery | 10-15 minutes in Redis | discovery service only |
| Encounter | candidate dedupe/safety | 24 hours; pseudonymous/coarse | restricted safety/system |
| Candidate | mutual flow | 7 days or dismissal/block | participants |
| Connection | social graph | until unmatch/deletion | participants |
| Message | user chat/safety | until conversation/account deletion; pilot cap 1 year | participants; scoped safety case |
| Report evidence | safety decision/appeal | 12 months, counsel-adjustable | trained moderators |
| Analytics | product experiment | 13 months, pseudonymous/aggregated | analysts |
| Audit/security logs | security/accountability | 12 months | security only |
| Backups | recovery | rolling 35 days | infrastructure only; age out |

Deletion immediately revokes sessions, removes discovery, disconnects providers and tombstones identity; asynchronous erasure is tracked and backups age out. Legal hold is exceptional, scoped and audited.
