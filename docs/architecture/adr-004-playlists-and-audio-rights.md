# ADR-004: Nearby playlists carry references, not commercial audio

Status: Accepted.

SYNQ playlists store canonical track references and provider mappings. Nearby transport exchanges only encrypted playlist/session identifiers and control state. Commercial provider audio remains inside each user's authorized provider player.

SYNQ may add an owned catalogue only for recordings with explicit territory, offline, synchronization and distribution rights represented in a rights ledger. Offline caches are encrypted, device-bound, expiring and non-exportable. P2P audio relay remains disabled unless a specific contract permits that exact use.

This separates technically possible file transfer from legally authorized distribution and keeps provider capabilities explicit.
