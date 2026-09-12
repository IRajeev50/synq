# Demo music rights ledger

Reviewed 12 September 2026. This catalogue uses two tracks whose individual Free Music Archive pages state Creative Commons Attribution 4.0. CC BY 4.0 permits sharing and adaptation, including commercial use, provided attribution and licence notice are retained. SYNQ keeps the original audio at the source URL and displays creator/licence attribution in the player.

| Asset | Creator | Source | Licence | Allowed demo capabilities | SHA-256 of inspected source file |
|---|---|---|---|---|---|
| Fine Instruments | 1000 Handz | https://freemusicarchive.org/music/1000-handz/cc-by-free-to-use-electronicgaming-instrumentals/fine-instruments/ | https://creativecommons.org/licenses/by/4.0/ | stream, offline cache, session control, redistribute with attribution | `d266855bf52a557f25c1f9f053c2afba40a04e3610cf0e44c38c8488da764b06` |
| In Search Of Sunset | 1000 Handz | https://freemusicarchive.org/music/1000-handz/cc-by-free-to-use-dancehouse-instrumentals/in-search-of-sunset/ | https://creativecommons.org/licenses/by/4.0/ | stream, offline cache, session control, redistribute with attribution | `74ebd095b3c70c266a744abce1cb4fb91ac6f34c481be655d3896901c8664293` |

The app does not call these tracks "copyright free." Attribution is required. `p2p_audio` is still not part of SYNQ's default nearby protocol; the demo shares track references and session state. A production catalogue needs source availability monitoring, ingestion copies under the licence, attribution UX, takedown handling and counsel review.

## Bundled offline demo excerpts

The mobile demo bundles a 30-second mono, 22.05 kHz, 64 kbps MP3 excerpt of each CC BY 4.0 track. Format conversion is allowed as an adaptation under CC BY 4.0; the UI preserves title, creator, licence and source attribution. These files are embedded in the JavaScript app bundle as local data assets so playback does not require a network request.

| Excerpt | SHA-256 |
|---|---|
| Fine Instruments, 30s demo excerpt | `d5d9b43c522e44ea20cb0f83068260b38682dbb850c593edb170629cf5f422ea` |
| In Search Of Sunset, 30s demo excerpt | `2b4aedfacee119855dea91dc1b68581e8e9ed5f85b50fcdba47aeb0244ca5e15` |
