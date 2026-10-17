# Screenshots

Drop your Sibyl screenshots into this folder using these exact filenames
(.jpeg). Until a file exists, the site shows a tasteful placeholder
automatically — nothing breaks if you launch before these are ready.

These are referenced from `data.js` → `screenLibrary`. Each "Why Sibyl" card
cycles through the screens listed for it in `difference.rows[].screens`.

| Filename                      | Capability it belongs to |
|--------------------------------|----------------------------|
| home_screen.jpeg               | Hero                        |
| manage_tags.jpeg               | Organization                |
| edit_tag_modal.jpeg            | Organization, File naming   |
| naming_settings.jpeg           | File naming                 |
| recording_playback.jpeg        | Hero                        |
| edit_recording.jpeg            | Editing                     |
| trim_recording.jpeg            | Editing                     |
| merge_recording.jpeg           | Editing                     |
| append_recording.jpeg          | Editing                     |
| search_main.jpeg               | Search                      |
| name_search.jpeg               | Search                      |
| transcription_search.jpeg      | Search                      |
| transcription_page.jpeg        | Transcription               |
| transcribing.jpeg              | Transcription               |
| transcribed.jpeg               | Hero, Transcription         |
| analytics_breakdown.jpeg       | Habit tracking              |
| analytics_graph.jpeg           | Habit tracking              |
| analytics_streak.jpeg          | Habit tracking              |
| appearance_settings1.jpeg      | Personalization             |
| appearance_settings2.jpeg      | Personalization             |
| choose_folder.jpeg             | Data portability            |
| save_folder.jpeg               | Data portability            |
| save_folder_option.jpeg        | Data portability            |
| sync_folder.jpeg               | Data portability            |
| privacy1.jpeg                  | Privacy model                |
| privacy2.jpeg                  | Privacy model                |

Tips:
- Export at roughly 3x resolution (e.g. ~1200×2600px) for a crisp phone mockup.
- To add a screen, add a row to `screenLibrary` in `data.js` with a short key
  and its filename, then reference that key from `difference.rows[].screens`.
  No HTML/CSS/JS changes needed.
