# Security model

Trust boundaries: mobile device, nearby radio, public API, provider OAuth, admin console, worker/queue and data stores. Every nearby payload is attacker-controlled.

Controls: Argon2id/managed OIDC; 10-minute access JWT with audience/issuer/key rotation; hashed rotating refresh tokens; device/session inventory; PKCE provider OAuth; resource-level authorization; schema validation; nonce/idempotency; rate limits; KMS envelope encryption; TLS; secrets manager; private subnets; immutable audit trail; dependency/SAST/secret scans; least-privilege admin with MFA.

Logs redact tokens, bodies, provider data and rendezvous values. Safety access requires case ID and is audited. Production break-glass is time-limited and reviewed.

See `docs/security/threat-model.md`.
