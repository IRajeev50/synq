# Music integrations

`MusicProvider` exposes authorize, refresh, currentUserSelectedTrack, search and disconnect. Capabilities are declared, not assumed.

- **Manual/catalog adapter:** MVP baseline. User searches/selects the current track; metadata normalized and provenance retained.
- **Spotify App Remote:** experimental flag. Requires explicit auth and active SDK connection; policy/launch review required. No rebroadcast or synchronized Spotify audio.
- **Apple Music/MusicKit:** iOS adapter for authorized catalog/library and SYNQ-initiated player state. Not system-wide listening surveillance.
- **YouTube Music:** no official arbitrary now-playing adapter. Manual share only until partnership.

Canonical track IDs are internal mappings with provider source IDs, ISRC when lawfully available, normalized title/artists/duration and match confidence. Cache only within provider terms. Provider tokens are encrypted and deletable.
