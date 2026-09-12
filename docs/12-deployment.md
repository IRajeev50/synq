# Deployment and runbook

Environments use separate AWS accounts/projects, databases, keys and provider redirect URIs. CI: format/lint/type/test, migration validation, dependency/secret/container scans, image build/SBOM/sign, deploy staging, smoke/security test, manual production approval, canary and rollback.

Staging: apply Terraform, migrate with backward-compatible scripts, seed synthetic users/tracks, deploy API/admin, register mobile development build and verify push/provider seams. No real provider secret belongs in git.

Production incident basics: identify blast radius, pause discovery/messaging through flags, preserve audit evidence, revoke compromised keys/sessions, communicate through approved process, restore/rollback, then write a blameless review. RPO 15m/RTO 4h pilot targets. Presence fails closed during Redis/API uncertainty.
