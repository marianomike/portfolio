// The single source for the whole site: the timeline, the resume view and the
// project pages all read from here. Dates are "YYYY-MM"; a missing `end` means
// the role is current.

export type Category = "games" | "apps" | "tools" | "web" | "talks";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "games", label: "Games" },
  { id: "apps", label: "Apps" },
  { id: "tools", label: "Roblox & tools" },
  { id: "web", label: "Web & interactive" },
  { id: "talks", label: "Talks & writing" },
];

export type Role = {
  title: string;
  start: string;
  end?: string;
  location?: string;
  bullets: string[];
};

export type Employer = {
  id: string;
  name: string;
  kind?: "Contract" | "Self-employed";
  roles: Role[]; // newest first
};

export type Link = { label: string; url: string };

export type Project = {
  slug: string; // also the URL, kept identical to the old uiuxartist.com paths
  title: string;
  start: string;
  end?: string;
  /** Omit for side projects, which sit on the timeline by their own date. */
  employer?: string;
  category: Category;
  blurb: string;
  links?: Link[];
};

export const PROFILE = {
  name: "Mike Mariano",
  headline: "Designer & developer",
  intro:
    "Designing interactive experiences since 2000 — from Flash courseware to Star Wars mobile games to the UI engine inside Roblox. Lately I design and build my own apps too.",
  location: "Fremont, California",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/marianomike" },
    { label: "GitHub", url: "https://github.com/marianomike" },
  ] as Link[],
};

export const EMPLOYERS: Employer[] = [
  {
    id: "finish-line-labs",
    name: "Finish Line Labs",
    kind: "Self-employed",
    roles: [
      {
        title: "Owner",
        start: "2025-11",
        bullets: ["The studio I publish my own iOS and Android apps and Roblox games under."],
      },
    ],
  },
  {
    id: "roblox",
    name: "Roblox",
    roles: [
      {
        title: "Senior Product Designer",
        start: "2020-12",
        location: "San Mateo, CA",
        bullets: [
          "Lead design and vision for the Engine Interactivity team (UI and Input)",
          "Shipped the Style Editor, which lets developers create and manage complex UI design systems",
          "Provide game UI guidance for partners and external developers",
          "Partner with engineering, product and fellow designers from concept to launch",
        ],
      },
    ],
  },
  {
    id: "captain",
    name: "Captain.tv",
    roles: [
      {
        title: "Lead UX Designer",
        start: "2019-04",
        end: "2020-12",
        bullets: [
          "Sole designer at an early-stage startup building games for Twitch streamers and their audiences",
          "Led UI design for Stream Raiders, the company's flagship product",
          "Contributed across product, marketing and brand, including the website and TwitchCon materials",
        ],
      },
    ],
  },
  {
    id: "zynga-2018",
    name: "Zynga",
    roles: [
      {
        title: "Principal UX Designer",
        start: "2018-11",
        end: "2019-04",
        bullets: [
          "Led UX for Game of Thrones Slots Casino",
          "Standardized the UI creation process across multiple studios",
        ],
      },
    ],
  },
  {
    id: "disney",
    name: "Disney Interactive / Lucasfilm Games",
    roles: [
      {
        title: "Lead UI Designer",
        start: "2016-07",
        end: "2018-10",
        location: "San Jose, CA",
        bullets: [
          "Set the visual style and direction of the UI/UX for Star Wars Rivals",
          "Mentored and managed two senior designers with detailed style guides",
          "Partnered with production, product, game design and engineering on scope, features and performance",
          "Worked directly with the Lucasfilm story group to represent the Star Wars brand",
        ],
      },
      {
        title: "Senior UI Designer",
        start: "2013-10",
        end: "2016-07",
        location: "Palo Alto, CA",
        bullets: [
          "Three years on Star Wars: Commander, from pre-production through green-light, launch and live operations",
          "UX, wireframing, visual design, iconography, prototyping and building UI tools",
        ],
      },
    ],
  },
  {
    id: "samsung",
    name: "Samsung Mobile",
    roles: [
      {
        title: "Lead UX Designer",
        start: "2012-12",
        end: "2013-10",
        location: "San Jose, CA",
        bullets: [
          "Member of the San Jose Mobile Communications Lab, designing and developing Android applications across devices",
        ],
      },
    ],
  },
  {
    id: "zynga",
    name: "Zynga",
    roles: [
      {
        title: "Lead UI Designer, FarmVille 2 Mobile",
        start: "2012-08",
        end: "2012-12",
        bullets: [
          "Interaction flows, Flash animation and development, illustration, rapid prototyping, team management and asset production",
        ],
      },
      { title: "Senior UI Designer, CastleVille", start: "2012-01", end: "2012-08", bullets: [] },
      { title: "Lead UI Designer, Mafia Wars 2", start: "2010-10", end: "2011-12", bullets: [] },
      { title: "Lead UI Designer, Mafia Wars", start: "2009-07", end: "2010-09", bullets: [] },
    ],
  },
  {
    id: "akqa",
    name: "AKQA",
    kind: "Contract",
    roles: [
      {
        title: "Interactive Developer",
        start: "2009-06",
        end: "2009-07",
        bullets: ["Developed a rich media campaign for Kraft Miracle Whip"],
      },
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft (Atlas Rich Media)",
    roles: [
      {
        title: "User Experience Designer",
        start: "2008-06",
        end: "2009-05",
        bullets: [
          "Creative services team: consulting, concept, prototype, production and QA across the whole ad lifecycle",
          "Rich interactive advertising for Kia, MTV, Sprite, SunChips, Got Milk?, ESPN, AT&T and Microsoft",
        ],
      },
    ],
  },
  {
    id: "blackarrow",
    name: "BlackArrow",
    roles: [
      {
        title: "Lead UI Designer",
        start: "2007-12",
        end: "2008-06",
        location: "San Mateo, CA",
        bullets: [
          "Wireframes, mockups, prototypes and page schematics to guide product and engineering",
          "Defined site structure, interaction flows and information architecture",
          "Turned usability tests, concept tests and surveys into action plans",
        ],
      },
    ],
  },
  {
    id: "paypal",
    name: "PayPal",
    kind: "Contract",
    roles: [
      {
        title: "Visual Designer",
        start: "2007-03",
        end: "2007-12",
        location: "San Jose, CA",
        bullets: [
          "High-fidelity comps from interaction designers' wireframes and sketches",
          "Iconography, color palettes, type styles and other visual assets",
          "Developed and evolved the company's visual design guidelines",
        ],
      },
    ],
  },
  {
    id: "bgcp-2007",
    name: "Boys & Girls Clubs of the Peninsula",
    roles: [
      {
        title: "Web Design Instructor",
        start: "2007-01",
        end: "2007-06",
        location: "East Palo Alto, CA",
        bullets: ["Ran a six-month class teaching web design to kids aged 12–16"],
      },
    ],
  },
  {
    id: "composer",
    name: "Composer",
    roles: [
      {
        title: "Senior Interactive Designer",
        start: "2005-09",
        end: "2006-09",
        location: "Scotts Valley, CA",
        bullets: [
          "Custom Flash websites and prototypes",
          "Logos, corporate branding and marketing materials",
          "Managed, trained and documented for the creative team",
        ],
      },
    ],
  },
  {
    id: "convergys",
    name: "Convergys",
    roles: [
      {
        title: "Interactive Designer",
        start: "2004-10",
        end: "2005-09",
        bullets: [
          "Flash courseware, prototypes and commercials",
          "Audio and video editing and compositing",
          "Character illustration and animation",
        ],
      },
    ],
  },
  {
    id: "vitesse",
    name: "Vitesse Learning",
    roles: [
      {
        title: "Flash Developer",
        start: "2004-01",
        end: "2004-10",
        location: "San Francisco, CA",
        bullets: [
          "Full lifecycle of Flash online training courses: storyboarding, prototyping, development and QA",
          "Flash demos, commercials and vector artwork for the graphics library",
        ],
      },
    ],
  },
  {
    id: "bgcp",
    name: "Boys & Girls Clubs of the Peninsula",
    roles: [
      {
        title: "Computer Clubhouse Coordinator",
        start: "2002-07",
        end: "2004-01",
        location: "East Palo Alto, CA",
        bullets: [
          "Built an after-school curriculum focused on multimedia development",
          "Ran Photoshop, Flash and Premiere workshops",
          "Recruited and trained mentors",
        ],
      },
    ],
  },
  {
    id: "smartforce",
    name: "SmartForce",
    roles: [
      {
        title: "Flash Designer",
        start: "2000-10",
        end: "2002-07",
        location: "Redwood City, CA",
        bullets: [
          "Flash e-learning catalog courseware",
          "Illustrations, intro animations and e-vite animations",
        ],
      },
    ],
  },
  {
    id: "covad",
    name: "Covad Communications",
    roles: [
      {
        title: "Flash Designer",
        start: "2000-06",
        end: "2000-11",
        location: "Santa Clara, CA",
        bullets: [
          "Character illustrations",
          "Flash online training courses, intro animations and process flow charts",
        ],
      },
    ],
  },
];

export const EDUCATION = [
  { school: "University of California, Davis", detail: "BA, Art Studio", start: "1997", end: "2000" },
  { school: "UC Santa Barbara", start: "1995", end: "1997" },
];

// TODO(recovery): years marked with the old site's archive dates are
// provisional until the Wayback pages are read.
export const PROJECTS: Project[] = [
  {
    slug: "dusk-dos",
    title: "Dusk Dos",
    start: "2026-10",
    employer: "finish-line-labs",
    category: "games",
    blurb:
      "Pusoy Dos as a roguelike: climb the Isles of Dusk table by table against creatures of Philippine folklore, each bending one rule.",
  },
  {
    slug: "pusoy-dos",
    title: "Pusoy Dos!",
    start: "2026-10",
    employer: "finish-line-labs",
    category: "games",
    blurb:
      "The Filipino card game for iPhone and Android, with a journey through Philippine history and its real heroes on the court cards.",
  },
  {
    slug: "play-world",
    title: "Play World",
    start: "2026-09",
    employer: "finish-line-labs",
    category: "games",
    blurb:
      "A cozy Roblox world of dress-up, rooms full of props and drag-and-drop play, where players keep their own avatars, restyled into its look.",
    links: [{ label: "Play on Roblox", url: "https://www.roblox.com/games/117658689486791/Play-World" }],
  },
  {
    slug: "isles-of-dusk",
    title: "Isles of Dusk",
    start: "2026-10",
    employer: "finish-line-labs",
    category: "games",
    blurb:
      "A card battler of Philippine folklore on Roblox and phones: claim the board row by row, island after island.",
    links: [{ label: "Play on Roblox", url: "https://www.roblox.com/games/87067473966880/Isles-of-Dusk" }],
  },
  {
    slug: "run-visuals",
    title: "Run Visuals",
    start: "2026-04",
    employer: "finish-line-labs",
    category: "apps",
    blurb:
      "Custom graphics, stickers and animated videos from Strava, Garmin and Apple Health data, on iOS and Android.",
    links: [
      { label: "App Store", url: "https://apps.apple.com/us/app/run-visuals/id6759010004" },
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=info.finishlinelabs.runcards" },
    ],
  },
  {
    slug: "media-stitch",
    title: "Media Stitch",
    start: "2025-01",
    employer: "finish-line-labs",
    category: "apps",
    blurb: "Combines photos and videos into one shareable video, with simple layouts and transitions that keep the focus on the content.",
    links: [{ label: "App Store", url: "https://apps.apple.com/us/app/media-stitch/id6751826519" }],
  },
  {
    slug: "run-story",
    title: "Run Story",
    start: "2023-01",
    employer: "finish-line-labs",
    category: "apps",
    blurb:
      "Run stats from Strava or Apple Health on top of your photos and videos, native on iOS and Android. 20k+ iOS downloads.",
    links: [
      { label: "App Store", url: "https://apps.apple.com/us/app/run-story/id6737940528" },
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.uiuxartist.runstory.release" },
    ],
  },
  {
    slug: "ui-shadows-corners",
    title: "UI Shadows & Individual Corners",
    start: "2026-06",
    employer: "roblox",
    category: "tools",
    blurb: "Native drop shadows for any UI element and per-corner rounding, built into the Roblox engine.",
    links: [
      { label: "Announcement on the DevForum", url: "https://devforum.roblox.com/t/full-release-new-ui-capabilities-shadows-individual-corners/4636263" },
      { label: "UIShadow docs", url: "https://create.roblox.com/docs/reference/engine/classes/UIShadow" },
    ],
  },
  {
    slug: "style-query",
    title: "StyleQuery & More Styling",
    start: "2026-05",
    employer: "roblox",
    category: "tools",
    blurb: "Container and media queries for Roblox UI: interfaces that adapt to size, aspect ratio and text size settings with no scripts.",
    links: [
      { label: "Announcement on the DevForum", url: "https://devforum.roblox.com/t/full-release-stylequery-more-styling-features/4566519" },
      { label: "Docs", url: "https://create.roblox.com/docs/reference/engine/classes/StyleQuery" },
      { label: "Demo on Roblox", url: "https://www.roblox.com/games/116745195863753/StyleQuery-Demo" },
    ],
  },
  {
    slug: "designing-ui-tips",
    title: "Designing UI: Tips & Best Practices",
    start: "2024-07",
    employer: "roblox",
    category: "talks",
    blurb: "A DevForum guide to cross-platform UI for creators who don't code: mobile first, scale vs. offset, anchoring and placement.",
    links: [{ label: "Read on the DevForum", url: "https://devforum.roblox.com/t/designing-ui-tips-and-best-practices/3074034" }],
  },
  {
    slug: "input-action-manager",
    title: "Input Action Manager",
    start: "2026-07",
    employer: "roblox",
    category: "tools",
    blurb: "A visual editor in Roblox Studio for building and auditing an experience's input: every context, action and platform binding in one table.",
    links: [
      { label: "Announcement on the DevForum", url: "https://devforum.roblox.com/t/studio-beta-input-action-manager/4737890" },
      { label: "Docs", url: "https://create.roblox.com/docs/input/input-action-system#input-action-manager" },
    ],
  },
  {
    slug: "style-editor",
    title: "Style Editor",
    start: "2025-05",
    employer: "roblox",
    category: "tools",
    blurb: "A no-code tool in Roblox Studio for creating and managing UI styles, design tokens and themes. Shipped with UI Styling.",
    links: [
      { label: "Announcement on the DevForum", url: "https://devforum.roblox.com/t/studio-beta-introducing-ui-styling/3660722" },
      { label: "Docs", url: "https://create.roblox.com/docs/ui/styling" },
    ],
  },
  {
    slug: "roblox",
    title: "Beyond the Dark",
    start: "2021-08",
    employer: "roblox",
    category: "games",
    blurb: "The Vistech Showcase, a Roblox experience whose UI became a documented resource for creators.",
    links: [
      { label: "Play on Roblox", url: "https://www.roblox.com/games/7208091524/Beyond-the-Dark-Vistech-Showcase" },
      { label: "UI docs", url: "https://create.roblox.com/docs/resources/beyond-the-dark/user-interface" },
    ],
  },
  {
    slug: "button-designer",
    title: "Button Designer",
    start: "2026-05",
    employer: "finish-line-labs",
    category: "tools",
    blurb:
      "A Photoshop-like button editor built inside Roblox in a weekend: color pickers, documents, a remixable feed and premium effects.",
    links: [{ label: "Play on Roblox", url: "https://www.roblox.com/games/102189464014234/Button-Designer" }],
  },
  {
    slug: "gdc-2022",
    title: "GDC UX Summit",
    start: "2022-03",
    employer: "roblox",
    category: "talks",
    blurb:
      "My UX Summit talk, It's Not Just About Design: Universal Approaches to Designing in a Collaborative Environment.",
    links: [{ label: "Watch on GDC Vault", url: "https://gdcvault.com/play/1027844/UX-Summit-It-s-Not" }],
  },
  {
    slug: "stream-raiders",
    title: "Stream Raiders",
    start: "2019-04",
    end: "2020-12",
    employer: "captain",
    category: "games",
    blurb: "A game built for Twitch streamers to play with their viewers alongside their main content. I was the only UI/UX designer.",
    links: [{ label: "streamcaptain.com", url: "https://streamcaptain.com" }],
  },
  {
    slug: "game-of-thrones-slots-casino",
    title: "Game of Thrones Slots Casino",
    start: "2018-11",
    end: "2019-04",
    employer: "zynga-2018",
    category: "games",
    blurb: "Six months helping the team define UI/UX standards and pipelines, while hands-on with wireframes, visuals, prototypes and Unity.",
  },
  {
    slug: "star-wars-rivals",
    title: "Star Wars: Rivals",
    start: "2016-07",
    end: "2018-10",
    employer: "disney",
    category: "games",
    blurb: "A mobile third-person shooter. I set its UI direction, built the UI pipeline and led the UI team.",
  },
  {
    slug: "my-last-run",
    title: "My Last Run",
    start: "2016-12",
    end: "2017-03",
    category: "apps",
    blurb: "My first iOS app, built to teach myself Swift: photos of your run stats from Apple Health. Open source.",
    links: [
      { label: "App Store", url: "https://apps.apple.com/us/app/my-last-run/id1202621918" },
      { label: "Source on GitHub", url: "https://github.com/marianomike/mylastrun" },
    ],
  },
  {
    slug: "disney-lucasfilm-games",
    title: "Tools, Prototypes & Exploration",
    start: "2013-10",
    end: "2018-10",
    employer: "disney",
    category: "tools",
    blurb: "An Illustrator-to-Unity UI exporter I wrote, AR prototypes, pipeline flows, style guides and visual exploration at Lucasfilm Games.",
  },
  {
    slug: "sketch-plugins",
    title: "Sketch Plugins",
    start: "2016-06",
    category: "tools",
    blurb: "Open-source plugins that take repetitive work out of Sketch: shared color palettes, organizing and duplicating symbols.",
    links: [{ label: "GitHub", url: "https://github.com/marianomike?tab=repositories" }],
  },
  {
    slug: "the-beginners-guide-to-writing-sketch-plugins",
    title: "The Beginner's Guide to Writing Sketch Plugins",
    start: "2016-08",
    category: "talks",
    blurb: "A seven-part series for designers writing their first Sketch plugin, shared by Sketch and Smashing Magazine.",
    links: [
      {
        label: "Read on Medium",
        url: "https://medium.com/@marianomike/the-beginners-guide-to-writing-sketch-plugins-part-1-28a5e3f01c68",
      },
    ],
  },
  {
    slug: "star-wars-commander",
    title: "Star Wars: Commander",
    start: "2013-10",
    end: "2016-07",
    employer: "disney",
    category: "games",
    blurb: "The longest-running Star Wars mobile game: 1M daily players at its peak and $100M+ lifetime revenue. Built from scratch.",
  },
  {
    slug: "universe",
    title: "Samsung Universe",
    start: "2012-12",
    end: "2013-10",
    employer: "samsung",
    category: "apps",
    blurb: "An unreleased social app for Samsung users. UX, visual design and specs; I managed a junior designer and three interns.",
  },
  {
    slug: "farmville-mobile",
    title: "FarmVille Mobile",
    start: "2012-08",
    end: "2012-12",
    employer: "zynga",
    category: "games",
    blurb: "Early concepts for bringing FarmVille 2 from Facebook to phones: tech, visual design and UX.",
  },
  {
    slug: "castleville",
    title: "CastleVille",
    start: "2012-01",
    end: "2012-08",
    employer: "zynga",
    category: "games",
    blurb: "New features, illustration, animation and implementation for the fifth most popular game on Facebook.",
  },
  {
    slug: "mafia-wars-2",
    title: "Mafia Wars 2",
    start: "2010-10",
    end: "2011-12",
    employer: "zynga",
    category: "games",
    blurb: "The Flash sequel to Mafia Wars. I led the UI team and made production assets and animation.",
  },
  {
    slug: "mafia-wars",
    title: "Mafia Wars",
    start: "2009-07",
    end: "2010-09",
    employer: "zynga",
    category: "games",
    blurb: "One of Facebook's biggest games: 3M daily players and close to $1M a day at its peak. I led the look and feel.",
  },
  {
    slug: "microsoft-advertising",
    title: "Microsoft Advertising",
    start: "2008-06",
    end: "2009-05",
    employer: "microsoft",
    category: "web",
    blurb: "Rich media banners, homepage takeovers and microsites for Got Milk?, Kia, Sprite, Amway and more.",
  },
];

/** The timeline's chapters, newest first. A project belongs to its employer's chapter. */
export type Chapter = { id: string; start: string; end?: string; employers: string[] };

export const CHAPTERS: Chapter[] = [
  { id: "finish-line-labs-chapter", start: "2025", employers: ["finish-line-labs"] },
  { id: "roblox-chapter", start: "2020", employers: ["roblox"] },
  { id: "2018", start: "2018", end: "2020", employers: ["captain", "zynga-2018"] },
  { id: "2013", start: "2013", end: "2018", employers: ["disney"] },
  { id: "2009", start: "2009", end: "2013", employers: ["samsung", "zynga"] },
  {
    id: "2000",
    start: "2000",
    end: "2009",
    employers: ["akqa", "microsoft", "blackarrow", "paypal", "bgcp-2007", "composer", "convergys", "vitesse", "bgcp", "smartforce", "covad"],
  },
];
