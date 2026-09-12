# Matching engine

MVP eligibility precedes scoring: both active, adult pilot members, neither blocked, risk allowed, overlapping discovery, token fresh, likely-near bucket, and minimum music signal.

Initial configurable score: exact track 0 or 70; artist overlap up to 15; taste overlap up to 10; context up to 5. No sensitive traits, popularity penalty or pay-to-rank. Exact track guarantees `exact` category but does not bypass safety.

Return a score band and minimal explanation, never raw histories. Log algorithm version, features used (not full histories), decision and experiment cohort. Offline evaluation checks acceptance and safety by cohort; online changes require flags and guardrails.
