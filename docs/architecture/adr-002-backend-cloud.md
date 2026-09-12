# ADR-002: TypeScript modular monolith on AWS

Status: Accepted.

NestJS-style TypeScript modules were chosen over early Go microservices and Python services. The MVP is dominated by state transitions, authorization and iteration, not CPU. Shared schemas reduce client/API drift. Go remains a later option for extracted presence or WebSocket hot paths; Python is reserved for offline data/ML jobs.

Deploy one stateless API and worker image to ECS Fargate. Use RDS PostgreSQL, ElastiCache Redis, SQS and S3. Avoid Kubernetes until team/scale requirements justify it.
