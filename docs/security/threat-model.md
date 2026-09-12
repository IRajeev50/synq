# Threat model

| Threat | Main controls | Residual risk/test |
|---|---|---|
| Account takeover | MFA-ready OIDC, refresh rotation/reuse detection, device revoke | SIM/email compromise; session tests |
| Fake/bot accounts | invite cohorts, verification, velocity/device/risk rules | determined farms; manual review |
| Location stalking | no coordinates/history, rotating opaque tokens, small delayed batches, blocks | repeated physical observation; red-team |
| BLE tracking/replay/relay | rotation, short TTL, nonce, server proof, encounter quotas | live relay remains possible; anomaly rules |
| Enumeration | UUIDs, uniform errors, no public search, authorization | side channels; API tests |
| Spam/harassment | mutual consent, request/message limits, block/report, moderator SLA | off-platform harm; safety playbook |
| Credential/provider-token theft | PKCE, encrypted tokens, no client secret, scope minimization | device compromise; revoke path |
| Message scraping | connection auth, cursor limits, rate/anomaly detection | compromised client; canary tests |
| Match manipulation | server scoring, signed flags, experiment audit | adversarial taste data |
| Insider/admin misuse | least privilege, MFA, reasoned access, immutable audit, dual control export | privileged cloud operator |

Emergency reports show local emergency guidance but do not claim to provide emergency response. AI flags are triage signals, never final enforcement without rules/human review for serious cases.
