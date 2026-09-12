# Cost model

Directional monthly AWS estimates, excluding salaries, taxes, provider licences and heavy AI: 10K users $700-$2K; 100K $4K-$12K; 1M $25K-$80K; 10M $180K-$600K+. Actual cost depends more on active discovery minutes, messages, retention and observability than registrations.

Drivers: RDS/Redis HA, WebSocket concurrency, event writes, logs/traces, outbound traffic, push orchestration, moderation and AI inference. Controls: TTL presence, bounded candidate fan-out, sampling/redaction, cold analytics storage, lifecycle policies, right-sized Fargate, reserved capacity after stable demand, budgets and per-feature cost metrics. Validate with load tests before commitments.
