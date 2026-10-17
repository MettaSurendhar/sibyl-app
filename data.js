/**
 * SIBYL - SITE CONTENT
 * ---------------------------------------------------------------
 * Every word, link and icon-choice on the site lives here.
 * index.html / style.css / script.js should not need to change for
 * routine updates - edit this file only.
 *
 * ICONS: reference an id from the <symbol> set defined in index.html
 * (search for "ICON SYMBOLS" there to see the full list).
 *
 * SCREENSHOTS: drop images into /assets/screenshots/ using the exact
 * filenames referenced in `screenLibrary` below (.jpeg). Until a file
 * exists, a styled placeholder shows automatically - nothing breaks.
 * ---------------------------------------------------------------
 */

window.SIBYL_DATA = {
	// ---- Global / meta -------------------------------------------------
	meta: {
		siteTitle: 'Sibyl - Speak, and be remembered',
		description:
			'Sibyl is a local-first, open-source voice diary for Android. Tag, transcribe and revisit your spoken thoughts, with nothing leaving your device unless you ask it to.',
		logo: 'assets/header-icon.png',
		icon: 'assets/icon-bg-removed.png',
		splash: 'assets/splash.png',
		repoUrl: 'https://github.com/MettaSurendhar/sibyl',
		// Point this at the exact .apk asset URL once you know it (right-click
		// the asset on your Releases page -> Copy Link Address). Until then,
		// it safely falls back to the release page itself.
		apkDirectUrl: '',
		releasesTagUrl:
			'https://github.com/MettaSurendhar/sibyl/releases/tag/v1.0.0',
		releasesUrl: 'https://github.com/MettaSurendhar/sibyl/releases',
		issuesUrl: 'https://github.com/MettaSurendhar/sibyl/issues',
		version: 'v1.0.0',
		arch: 'arm64-v8a',
		license: 'MIT',
		year: 2026,
	},

	// ---- Top navigation --------------------------------------------------
	nav: [
		{ id: 'overview', label: 'Overview' },
		{ id: 'difference', label: 'Why Sibyl' },
		{ id: 'features', label: 'Features' },
		{ id: 'privacy', label: 'Privacy' },
		{ id: 'download', label: 'Download' },
	],

	// ---- Hero ---------------------------------------------------------
	hero: {
		eyebrow: 'Voice diary for Android',
		tagline: 'Speak, and be remembered',
		headline: 'Every thought deserves a record, not just a recording.',
		lede: "Sibyl is a voice diary for people who think out loud. Talk into it the way you'd talk into a mirror. Sibyl tags it, transcribes it, and keeps it entirely on your phone unless you decide otherwise.",
		ctaPrimary: {
			label: 'Download for Android',
			sublabel: 'v1.0.0 \u00b7 arm64-v8a \u00b7 free & open source',
		},
		ctaSecondary: {
			label: 'Read the source',
			url: 'https://github.com/MettaSurendhar/sibyl',
			icon: 'github',
		},
		// splash.png is the app's own fixed splash art and always comes first;
		// these cycle in after it. Each falls back to a placeholder until the
		// matching file exists in /assets/screenshots/.
		screenshots: [
			'home_screen.jpeg',
			'recording_playback.jpeg',
			'transcribed.jpeg',
		],
	},

	// ---- Pillar strip (quick stats under hero) ---------------------------
	pillars: [
		{
			icon: 'shield',
			value: '0',
			unit: 'servers',
			label: 'Sibyl has none. Your recordings stay on your device.',
		},
		{
			icon: 'scissors',
			value: '3',
			unit: 'edits',
			label: 'Trim, merge and append, none of them touch the original file.',
		},
		{
			icon: 'palette',
			value: '6 \u00d7 6',
			unit: 'themes & fonts',
			label: 'Pick a look and a voice for the app that feels like yours.',
		},
		{
			icon: 'key',
			value: '1',
			unit: 'outbound call',
			label:
				'The only network request Sibyl ever makes is a transcript, sent to Groq, only when you ask.',
		},
	],

	// ---- Shared screenshot catalogue --------------------------------------
	// One place mapping a short key to a real screenshot filename + label,
	// drawn from the app's own screen documentation. Referenced by the "Why
	// Sibyl" cards below so each capability can show the screen it's actually
	// talking about. Add a row here, then reference its key anywhere.
	screenLibrary: {
		home: { file: 'home_screen.jpeg', label: 'Home' },
		search: { file: 'search_main.jpeg', label: 'Library' },
		nameSearch: {
			file: 'name_search.jpeg',
			label: 'Record Name \u00b7 Search',
		},
		transcriptionSearch: {
			file: 'transcription_search.jpeg',
			label: 'Transcription \u00b7 Search',
		},
		manageTags: { file: 'manage_tags.jpeg', label: 'Manage Tags' },
		editTag: { file: 'edit_tag_modal.jpeg', label: 'Edit Tag' },
		namingSettings: { file: 'naming_settings.jpeg', label: 'Naming & Tags' },
		playback: { file: 'recording_playback.jpeg', label: 'Playback' },
		editRecording: { file: 'edit_recording.jpeg', label: 'Edit Recording' },
		trim: { file: 'trim_recording.jpeg', label: 'Trim Recording' },
		merge: { file: 'merge_recording.jpeg', label: 'Merge Recording' },
		append: { file: 'append_recording.jpeg', label: 'Append Recording' },
		transcriptionPage: {
			file: 'transcription_page.jpeg',
			label: 'Transcription',
		},
		transcribing: { file: 'transcribing.jpeg', label: 'Transcribing' },
		transcribed: { file: 'transcribed.jpeg', label: 'Transcribed' },
		analytics: { file: 'analytics_breakdown.jpeg', label: 'Pie Chart' },
		graph: { file: 'analytics_graph.jpeg', label: 'Graph' },
		streak: { file: 'analytics_streak.jpeg', label: 'Streak' },
		appearance1: { file: 'appearance_settings1.jpeg', label: 'Appearance' },
		appearance2: { file: 'appearance_settings2.jpeg', label: 'Appearance' },
		chooseFolder: {
			file: 'choose_folder.jpeg',
			label: 'Choose Folder',
		},
		saveFolder: {
			file: 'save_folder.jpeg',
			label: 'Save Folder',
		},
		saveFolderOption: {
			file: 'save_folder_option.jpeg',
			label: 'Save Folder Option',
		},
		syncFolder: {
			file: 'sync_folder.jpeg',
			label: 'Sync Folder',
		},
		privacy1: { file: 'privacy1.jpeg', label: 'Local-first' },
		privacy2: { file: 'privacy2.jpeg', label: 'Local-first' },
	},

	// ---- Difference / "Why Sibyl" — orbit layout ------------------------
	difference: {
		heading: 'How Sibyl differs from a stock voice recorder',
		intro:
			"A phone's built-in recorder does one thing: record, save to a flat list, play. Sibyl was built for people keeping a diary, not a memo pad.",
		rows: [
			{
				icon: 'tag',
				capability: 'Organization',
				typical: 'A flat, numbered file list',
				sibyl:
					'Custom tags with colour, icon and naming rules, grouped by date',
				screens: ['manageTags', 'editTag'],
			},
			{
				icon: 'pencil',
				capability: 'File naming',
				typical: 'Fixed \u201cRecording 001\u201d pattern',
				sibyl: 'Naming templates you write yourself, per tag and per edit type',
				screens: ['namingSettings', 'editTag'],
			},
			{
				icon: 'scissors',
				capability: 'Editing',
				typical: 'Trim only, and it overwrites the original',
				sibyl:
					'Trim, merge & append, each saved as a new file, original untouched',
				screens: ['editRecording', 'trim', 'merge', 'append'],
			},
			{
				icon: 'search',
				capability: 'Search',
				typical: 'By filename only',
				sibyl: 'By filename, or by the words spoken inside the recording',
				screens: ['search', 'nameSearch', 'transcriptionSearch'],
			},
			{
				icon: 'waveform',
				capability: 'Transcription',
				typical: 'Absent, or a paid add-on',
				sibyl: 'Built in, using a free API key you control',
				screens: ['transcriptionPage', 'transcribing', 'transcribed'],
			},
			{
				icon: 'streak',
				capability: 'Habit tracking',
				typical: 'None',
				sibyl: 'Streaks, monthly activity, per-tag trends on the home screen',
				screens: ['graph', 'analytics', 'streak'],
			},
			{
				icon: 'palette',
				capability: 'Personalization',
				typical: 'One fixed look',
				sibyl: 'Six themes, six typefaces, a name Sibyl greets you by',
				screens: ['appearance1', 'appearance2'],
			},
			{
				icon: 'folderSync',
				capability: 'Data portability',
				typical: "Locked inside the app's storage",
				sibyl:
					'An optional folder that syncs both ways, so recordings are also real files',
				screens: [
					'chooseFolder',
					'saveFolder',
					'saveFolderOption',
					'syncFolder',
				],
			},
			{
				icon: 'shield',
				capability: 'Privacy model',
				typical: 'Often cloud-backed by default',
				sibyl: 'Local-first, no company servers, one opt-in call to Groq',
				screens: ['privacy1', 'privacy2'],
			},
		],
	},

	// ---- Feature groups (icon + keyword chips, two with an illustration) --
	featureGroups: {
		heading: "Everything a diary needs, none of what it doesn't",
		intro:
			'Five ideas, built to work together, not five separate apps stapled into one.',
		groups: [
			{
				icon: 'tag',
				title: 'Organization',
				blurb: 'A diary needs categories, not a folder.',
				size: 'large',
				illustration: 'illus-organize',
				features: [
					{ icon: 'tag', text: 'Custom tags' },
					{ icon: 'pencil', text: 'Your own naming' },
					{ icon: 'calendar', text: 'Grouped by date' },
					{ icon: 'search', text: 'Full-text search' },
					{ icon: 'check', text: 'Bulk actions' },
				],
			},
			{
				icon: 'play',
				title: 'Playback',
				blurb: 'Built for long, rambling sessions, not ten-second memos.',
				size: 'small',
				features: [
					{ icon: 'waveform', text: 'Adaptive waveform' },
					{ icon: 'gauge', text: 'Variable speed' },
					{ icon: 'bolt', text: 'Skip silence' },
					{ icon: 'bell', text: 'Set as ringtone' },
				],
			},
			{
				icon: 'scissors',
				title: 'Non-destructive editing',
				blurb: 'Trim, merge and append. Never overwrite.',
				size: 'small',
				features: [
					{ icon: 'scissors', text: 'Precise trim' },
					{ icon: 'merge', text: 'Merge recordings' },
					{ icon: 'mic', text: 'Append audio' },
				],
			},
			{
				icon: 'waveform',
				title: 'AI transcription',
				blurb: 'Speech to text, using a key that belongs to you.',
				size: 'large',
				illustration: 'illus-transcribe',
				features: [
					{ icon: 'key', text: 'Your own API key' },
					{ icon: 'bolt', text: 'One-tap transcribe' },
					{ icon: 'globe2', text: 'Fast or accurate' },
					{ icon: 'download', text: 'Exportable text' },
					{ icon: 'info', text: 'Honest accuracy notes' },
				],
			},
			{
				icon: 'chart',
				title: 'Analytics',
				blurb: 'Turns a habit into something you can see.',
				size: 'wide',
				features: [
					{ icon: 'chart', text: 'Total & average time' },
					{ icon: 'streak', text: 'Daily streaks' },
					{ icon: 'calendar', text: 'Monthly activity' },
					{ icon: 'chart', text: 'Per-tag trends' },
				],
			},
		],
	},

	// ---- Privacy / local-first ------------------------------------------
	// Rendered top to bottom in this order: heading, intro, quote, the
	// device/server/Groq diagram, then the four-point list.
	privacy: {
		heading: 'The vow',
		intro:
			"Local-first isn't a setting in Sibyl. It's the only way the app was ever built.",
		quote: 'We do not sync, store, or have access to your data.',
		quoteSource: "Sibyl's own Privacy Policy, in the app",
		diagram: {
			deviceLabel: 'Your device',
			deviceNote: 'Recordings \u00b7 Tags \u00b7 Transcripts',
			cloudLabel: 'No Sibyl server',
			cloudNote: 'None exists',
			groqLabel: 'Groq',
			groqNote: 'Transcription only, opt-in, per recording',
		},
		points: [
			{
				icon: 'lock',
				title: 'No accounts',
				detail: 'Nothing to sign up for, nothing to log into.',
			},
			{
				icon: 'eyeOff',
				title: 'No analytics',
				detail: "Sibyl doesn't watch how you use it.",
			},
			{
				icon: 'folderSync',
				title: 'No lock-in',
				detail:
					'An optional folder sync keeps your recordings as real files you can read from anywhere.',
			},
			{
				icon: 'key',
				title: 'One exception, disclosed',
				detail:
					'Transcription is opt-in, per recording, and goes only to the API key you provide.',
			},
		],
	},

	// ---- Download -------------------------------------------------------
	download: {
		heading: 'Get Sibyl',
		intro:
			'Free, open source, and yours to keep. No store account, no waiting on a review queue.',
		primary: {
			label: 'Download the APK',
			note: 'v1.0.0 \u00b7 arm64-v8a \u00b7 a lighter install',
		},
		steps: [
			{
				title: 'Download',
				detail: "Grab the APK below. It's a direct file, not a store listing.",
			},
			{
				title: 'Allow the install',
				detail:
					"Android will ask once to allow installs from this source. That's expected for an app outside the Play Store.",
			},
			{
				title: 'Open & speak',
				detail:
					'No account, no setup screen standing between you and your first recording.',
			},
		],
		secondaryLinks: [
			{
				label: 'Browse releases',
				url: 'https://github.com/MettaSurendhar/sibyl/releases',
				icon: 'download',
			},
			{
				label: 'View source on GitHub',
				url: 'https://github.com/MettaSurendhar/sibyl',
				icon: 'github',
			},
			{
				label: 'Report an issue',
				url: 'https://github.com/MettaSurendhar/sibyl/issues',
				icon: 'info',
			},
		],
		badges: [
			{ label: 'F-Droid', status: 'Coming soon' },
			{ label: 'IzzyOnDroid', status: 'Coming soon' },
		],
	},

	// ---- Creator ----------------------------------------------------------
	creator: {
		heading: 'Made by one person, in the open',
		name: 'Metta Surendhar',
		tagline:
			"I designed and built Sibyl end to end: product, engineering and this site. If you're into local-first tools or Android/React Native, I'd love to hear from you.",
		initials: 'MS',
		photo: 'assets/creator-photo.png',
		links: [
			{
				label: 'Portfolio',
				url: 'https://mettasurendhar.github.io/',
				icon: 'globe2',
			},
			{
				label: 'LinkedIn',
				url: 'https://www.linkedin.com/in/metta-surendhar/',
				icon: 'linkedin',
			},
			{
				label: 'GitHub',
				url: 'https://github.com/MettaSurendhar',
				icon: 'github',
			},
			{
				label: 'Medium',
				url: 'https://medium.com/@mettasurendhar',
				icon: 'medium',
			},
		],
	},

	// ---- Footer --------------------------------------------------------------
	footer: {
		line1: 'Sibyl. Speak, and be remembered.',
		line2: 'MIT licensed. Built in the open.',
		links: [
			{ label: 'GitHub', url: 'https://github.com/MettaSurendhar/sibyl' },
			{
				label: 'Releases',
				url: 'https://github.com/MettaSurendhar/sibyl/releases',
			},
			{
				label: 'Issues',
				url: 'https://github.com/MettaSurendhar/sibyl/issues',
			},
			{
				label: 'License',
				url: 'https://github.com/MettaSurendhar/sibyl/blob/main/LICENSE',
			},
		],
	},
};
