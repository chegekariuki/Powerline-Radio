/**
 * Powerline Radio – data.js
 * Central content store for audio programmes and blog posts.
 *
 * In production this data would come from a CMS API (WordPress REST API,
 * Contentful, Sanity, etc.) or a server-rendered backend.  For the static
 * version every content editor only needs to edit this one file.
 *
 * Audio files should be hosted on a CDN, podcast host (e.g. Buzzsprout,
 * Podbean, Anchor/Spotify for Podcasters) or your own streaming server.
 * Replace the placeholder `audioUrl` values with real URLs.
 */

'use strict';

/* ============================================================
   PROGRAMME EPISODES
   ============================================================ */

/**
 * @typedef {Object} Episode
 * @property {number}  id
 * @property {string}  title
 * @property {string}  show        – name of the parent show
 * @property {string}  showSlug    – URL-safe show identifier used for filtering
 * @property {string}  host
 * @property {string}  date        – ISO 8601 (YYYY-MM-DD)
 * @property {string}  duration    – HH:MM or MM:SS display string
 * @property {number}  durationSec – total seconds (used for progress bar maths)
 * @property {string}  description
 * @property {string}  audioUrl    – MP3 / OGG / AAC stream / CDN URL
 * @property {string}  category    – grouping key
 * @property {boolean} featured
 */

/** @type {Episode[]} */
const EPISODES = [
  {
    id: 1,
    title: 'Finding Peace in Difficult Times',
    show: 'Sunday Bible Study',
    showSlug: 'bible-study',
    host: 'Pastor James Mwangi',
    date: '2026-03-09',
    duration: '54:22',
    durationSec: 3262,
    description:
      'A deep dive into Philippians 4:6-7 — "Do not be anxious about anything." ' +
      'Pastor James walks us through practical steps for anchoring our peace in faith ' +
      'when life feels overwhelming.',
    audioUrl: 'audio/ep-001-finding-peace.mp3',
    category: 'bible-study',
    featured: true,
  },
  {
    id: 2,
    title: 'Morning Devotion – The Power of Gratitude',
    show: 'Early Morning Devotion',
    showSlug: 'morning-devotion',
    host: 'Pastor Samuel Kariuki',
    date: '2026-03-10',
    duration: '22:10',
    durationSec: 1330,
    description:
      'Starting your day with a thankful heart transforms how you see every challenge. ' +
      'Pastor Samuel shares five morning habits rooted in Scripture that build a lifestyle of gratitude.',
    audioUrl: 'audio/ep-002-power-of-gratitude.mp3',
    category: 'devotion',
    featured: true,
  },
  {
    id: 3,
    title: 'Youth & Social Media – Navigating Faith Online',
    show: 'Youth Connect',
    showSlug: 'youth-connect',
    host: 'Brian Mwenda',
    date: '2026-03-08',
    duration: '38:45',
    durationSec: 2325,
    description:
      'Social media can build community or destroy it.  Brian Mwenda and guests discuss ' +
      'how young Christians can use platforms like TikTok and Instagram as tools for spreading hope.',
    audioUrl: 'audio/ep-003-faith-online.mp3',
    category: 'youth',
    featured: false,
  },
  {
    id: 4,
    title: 'Raising Godly Children in a Digital Age',
    show: 'Family Time',
    showSlug: 'family-time',
    host: 'David & Ruth',
    date: '2026-03-07',
    duration: '46:30',
    durationSec: 2790,
    description:
      'Parenting expert Mama Grace joins David and Ruth to explore screen-time boundaries, ' +
      'family devotions, and how to have honest faith conversations with your children.',
    audioUrl: 'audio/ep-004-raising-godly-children.mp3',
    category: 'family',
    featured: false,
  },
  {
    id: 5,
    title: 'Gospel Music Through the Decades',
    show: 'Afternoon Gospel Mix',
    showSlug: 'gospel-mix',
    host: 'Moses Kamau',
    date: '2026-03-06',
    duration: '1:02:15',
    durationSec: 3735,
    description:
      'A musical journey from the soul hymns of the 1960s to contemporary African gospel. ' +
      'Moses takes us through landmark recordings and the stories behind them.',
    audioUrl: 'audio/ep-005-gospel-through-decades.mp3',
    category: 'music',
    featured: true,
  },
  {
    id: 6,
    title: 'Prayer & Fasting – A Beginner\'s Guide',
    show: 'Sunday Bible Study',
    showSlug: 'bible-study',
    host: 'Pastor James Mwangi',
    date: '2026-03-02',
    duration: '51:08',
    durationSec: 3068,
    description:
      'Many believers feel intimidated by fasting.  This episode demystifies the practice ' +
      'using Matthew 6 as a guide and includes testimonies from four members of our listener community.',
    audioUrl: 'audio/ep-006-prayer-fasting.mp3',
    category: 'bible-study',
    featured: false,
  },
  {
    id: 7,
    title: 'Swahili Worship Gems – Wimbo wa Imani',
    show: 'Swahili Gospel Show',
    showSlug: 'swahili-gospel',
    host: 'Mama Pendo',
    date: '2026-03-01',
    duration: '44:00',
    durationSec: 2640,
    description:
      'Mama Pendo curates an hour of the finest Swahili-language worship music, sharing ' +
      'the stories of the songwriters and what inspired each track.',
    audioUrl: 'audio/ep-007-swahili-worship-gems.mp3',
    category: 'music',
    featured: false,
  },
  {
    id: 8,
    title: 'Overcoming Addiction Through Faith',
    show: 'Evening Worship Hour',
    showSlug: 'evening-worship',
    host: 'Choir of Hope',
    date: '2026-02-28',
    duration: '58:40',
    durationSec: 3520,
    description:
      'A candid, hope-filled conversation with three individuals whose lives were transformed ' +
      'through community, counselling, and deep faith.  An episode that will move you to tears.',
    audioUrl: 'audio/ep-008-overcoming-addiction.mp3',
    category: 'testimony',
    featured: false,
  },
];

/* ============================================================
   BLOG POSTS
   ============================================================ */

/**
 * @typedef {Object} BlogPost
 * @property {number}   id
 * @property {string}   title
 * @property {string}   slug
 * @property {string}   author
 * @property {string}   authorRole
 * @property {string}   date        – ISO 8601
 * @property {string}   category    – grouping key
 * @property {string}   categoryLabel
 * @property {string}   excerpt     – short summary (max ~200 chars)
 * @property {string}   content     – full HTML body (paragraphs separated by \n)
 * @property {string[]} tags
 * @property {boolean}  featured
 */

/** @type {BlogPost[]} */
const BLOG_POSTS = [
  {
    id: 1,
    title: 'Why Christian Radio Still Matters in 2026',
    slug: 'why-christian-radio-matters-2026',
    author: 'Grace Wanjiku',
    authorRole: 'Breakfast Show Host',
    date: '2026-03-10',
    category: 'faith',
    categoryLabel: 'Faith',
    excerpt:
      'In an age of streaming algorithms and social-media noise, the human voice ' +
      'speaking truth over the airwaves remains one of the most powerful tools for community connection.',
    content:
      '<p>When Spotify recommends another song based on what you listened to last Thursday, ' +
      'it does so to keep you engaged—not to challenge you, comfort you in grief, or pray with you. ' +
      'Christian radio does something fundamentally different.</p>\n' +
      '<p>At Powerline Radio we receive letters every week from listeners who heard a timely devotional ' +
      'during a hospital visit, or a worship song that broke through years of pain. ' +
      'No algorithm planned that. It was simply the right voice at the right time—and that is the gift of live radio.</p>\n' +
      '<p>As we move deeper into 2026, our commitment is to keep the signal strong: more locally produced ' +
      'content, deeper community engagement, and programmes that meet listeners exactly where they are.</p>',
    tags: ['faith', 'community', 'radio', 'streaming'],
    featured: true,
  },
  {
    id: 2,
    title: 'How to Start a Daily Devotion Habit',
    slug: 'how-to-start-daily-devotion-habit',
    author: 'Pastor Samuel Kariuki',
    authorRole: 'Lead Pastor',
    date: '2026-03-08',
    category: 'devotion',
    categoryLabel: 'Devotion',
    excerpt:
      'Five practical steps—backed by Scripture and science—that will help you build ' +
      'a consistent morning devotion routine even when life gets busy.',
    content:
      '<p>The science of habit formation is clear: small consistent actions, done at the same ' +
      'time every day, build neural pathways that eventually make the habit automatic. ' +
      'The same principle applies beautifully to spiritual disciplines.</p>\n' +
      '<p><strong>1. Start tiny.</strong> Five minutes of Scripture reading beats zero minutes of a ' +
      'planned-but-skipped hour. Begin with one psalm a morning.</p>\n' +
      '<p><strong>2. Anchor it to an existing habit.</strong> Make your devotion the first thing you do ' +
      'after you pour your morning tea or coffee. The existing trigger pulls the new behaviour along.</p>\n' +
      '<p><strong>3. Prepare the night before.</strong> Leave your Bible open, your journal on the table, ' +
      'and your Powerline Radio app loaded so there is zero friction in the morning.</p>\n' +
      '<p><strong>4. Celebrate every streak.</strong> God rejoices in your faithfulness. Tell a friend, ' +
      'keep a simple tick-sheet, or share your progress with our WhatsApp community group.</p>\n' +
      '<p><strong>5. Extend grace to yourself.</strong> Missing a day is not failure—returning is faithfulness.</p>',
    tags: ['devotion', 'habits', 'prayer', 'scripture'],
    featured: true,
  },
  {
    id: 3,
    title: 'Powerline Radio Reaches 50,000 Monthly Listeners',
    slug: 'powerline-radio-reaches-50000-listeners',
    author: 'Powerline Radio Editorial',
    authorRole: 'News Desk',
    date: '2026-03-05',
    category: 'news',
    categoryLabel: 'Station News',
    excerpt:
      'We are overjoyed to share that Powerline Radio crossed the 50,000 monthly listener milestone ' +
      'this March—a testament to your faithfulness and God\'s grace.',
    content:
      '<p>Last week our analytics team confirmed what our hearts already knew: <strong>Powerline Radio ' +
      'now reaches over 50,000 unique listeners every month</strong> across FM, online streaming, and ' +
      'our growing podcast catalogue.</p>\n' +
      '<p>This is more than a number. Behind each stream is a person—someone seeking hope, comfort, ' +
      'community, or simply the sound of familiar praise music on a long commute. ' +
      'Thank you for being part of this story.</p>\n' +
      '<p>To mark the milestone we are launching two new weekly programmes in April: ' +
      '<em>Voices of Hope</em>—a listener testimony show—and <em>Tech &amp; Faith</em>, ' +
      'exploring how digital tools can deepen our walk with God.</p>',
    tags: ['milestone', 'news', 'growth'],
    featured: true,
  },
  {
    id: 4,
    title: 'Youth Rally 2026 – Save the Date',
    slug: 'youth-rally-2026',
    author: 'Brian Mwenda',
    authorRole: 'Youth Connect Host',
    date: '2026-03-03',
    category: 'events',
    categoryLabel: 'Events',
    excerpt:
      'Mark your calendars! The annual Powerline Radio Youth Rally returns on 18 April 2026 ' +
      'at Uhuru Gardens, Nairobi. Registration is free.',
    content:
      '<p>The Youth Rally is our flagship in-person event and we have spent months planning ' +
      'something truly special for 2026. Here is what to expect:</p>\n' +
      '<ul><li><strong>Worship</strong> – Live performances from six of Kenya\'s fastest-rising ' +
      'gospel artists</li>\n' +
      '<li><strong>Talks</strong> – Inspirational messages from youth leaders and entrepreneurs ' +
      'who are living out their faith in the marketplace</li>\n' +
      '<li><strong>Workshops</strong> – Practical sessions on mental health, career guidance, ' +
      'and digital evangelism</li>\n' +
      '<li><strong>Community</strong> – Connect with 2,000+ young believers from across East Africa</li></ul>\n' +
      '<p>Register free at the contact form below. Buses will depart from five collection points ' +
      'across Nairobi. See you there!</p>',
    tags: ['youth', 'events', 'rally', 'nairobi'],
    featured: false,
  },
  {
    id: 5,
    title: 'The Story Behind Our Theme Song',
    slug: 'story-behind-theme-song',
    author: 'Moses Kamau',
    authorRole: 'Afternoon Gospel Mix Host',
    date: '2026-02-28',
    category: 'music',
    categoryLabel: 'Music',
    excerpt:
      'Few people know that "A Flash of Hope", the signature jingle that opens every Powerline Radio ' +
      'broadcast, was composed in a single night during a power blackout.',
    content:
      '<p>In 2014, with the station barely six months old, producer Daniel Otieno found himself ' +
      'in the studio with no electricity—just a battery-powered keyboard and a deadline. ' +
      'By torchlight he sketched the four-bar motif that would become the most recognised piece of ' +
      'music in our station\'s history.</p>\n' +
      '<p>"I had been reading Isaiah 9:2—<em>\'The people walking in darkness have seen a great light\'</em>. ' +
      'That image of a flash cutting through the dark—that\'s where the melody came from," Daniel recalls.</p>\n' +
      '<p>The jingle has been re-recorded three times but the core melody has never changed. ' +
      'Listen carefully the next time you tune in. That simple phrase is a small act of faith, ' +
      'preserved across a decade of broadcasting.</p>',
    tags: ['music', 'history', 'jingle', 'station'],
    featured: false,
  },
  {
    id: 6,
    title: 'Interview: Mama Pendo on 20 Years of Swahili Gospel',
    slug: 'interview-mama-pendo-swahili-gospel',
    author: 'Faith Njeri',
    authorRole: 'Midday Host',
    date: '2026-02-24',
    category: 'interview',
    categoryLabel: 'Interview',
    excerpt:
      'We sat down with beloved host Mama Pendo to look back on two decades of broadcasting ' +
      'Swahili gospel music and her vision for the next generation.',
    content:
      '<p><strong>Faith:</strong> Mama Pendo, twenty years is extraordinary. What keeps you going?</p>\n' +
      '<p><strong>Mama Pendo:</strong> Every single listener letter. When someone writes to say ' +
      'they heard a song in Kiswahili that finally made them understand a Scripture they had ' +
      'struggled with in English—that is why I do this.</p>\n' +
      '<p><strong>Faith:</strong> How has Swahili gospel music changed?</p>\n' +
      '<p><strong>Mama Pendo:</strong> The production quality has improved enormously. ' +
      'Our young artists are internationally competitive now. But the heart—the <em>moyo</em>—remains. ' +
      'We are still singing the same faith, just with better microphones.</p>\n' +
      '<p><strong>Faith:</strong> What would you say to the next generation of gospel artists?</p>\n' +
      '<p><strong>Mama Pendo:</strong> Sing what you know. Sing your pain, your praise, your questions. ' +
      'Authenticity travels further than perfection.</p>',
    tags: ['interview', 'swahili', 'music', 'mama-pendo'],
    featured: false,
  },
];

/* ============================================================
   CATEGORY METADATA
   ============================================================ */

const EPISODE_CATEGORIES = [
  { slug: 'all',         label: 'All Episodes'    },
  { slug: 'bible-study', label: 'Bible Study'      },
  { slug: 'devotion',    label: 'Devotion'         },
  { slug: 'youth',       label: 'Youth'            },
  { slug: 'family',      label: 'Family'           },
  { slug: 'music',       label: 'Music'            },
  { slug: 'testimony',   label: 'Testimony'        },
];

const BLOG_CATEGORIES = [
  { slug: 'all',       label: 'All Posts'     },
  { slug: 'faith',     label: 'Faith'         },
  { slug: 'devotion',  label: 'Devotion'      },
  { slug: 'news',      label: 'Station News'  },
  { slug: 'events',    label: 'Events'        },
  { slug: 'music',     label: 'Music'         },
  { slug: 'interview', label: 'Interview'     },
];
