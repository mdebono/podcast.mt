// src/lib/i18n.js
// Simple i18n for Maltese (MT) and English (EN)

const translations = {
  mt: {
    // Navigation
    home: 'Dar',
    shows: 'Podcasts',
    episodes: 'Episodi',
    submit: 'Żid',
    about: 'Dwar',
    submitShow: '+ Żid Podcast',

    // Hero
    heroTitle: 'Poddati<br/><em>minn Malta.</em>',
    heroSub: 'Skopri podcasts mill-gżejjer Maltin — bil-Malti, bl-Ingliż, u aktar.',
    heroStatsShows: 'podcasts',
    heroStatsUpdated: 'Aġġornat kull 6 sigħat',
    heroStatsFree: 'B’xejn biex tniżżel',
    browseAllShows: 'Ara l-Podcasts Kollha',
    submitYourShow: 'Żid il-Podcast Tiegħek',

    // Sections
    latestEpisodes: 'Episodji Riċenti',
    seeAll: 'Ara kollox →',
    allShows: 'Podcasts',
    browseDirectory: 'Iftaħ id-direttorju →',

    // CTA
    gotPodcast: 'Għandek podcast Malti?',
    listHere: 'Żidu magħna b’xejn. Ilħaq udjenza Maltija li qed tfittex kontenut lokali.',
    submitShow: 'Żid il-Podcast Tiegħek',

    // Footer
    madeWithLove: 'Magħmul b’imħabba f’Malta 🇲🇹',
    discover: 'Skopri',
    creators: 'Produtturi',
    getBadge: 'Ikseb il-Badge',
    aboutUs: 'Dwarna',
    contact: 'Kuntatt',
    knowOne: 'Xi ħaġa nieqsa?',
    directory: 'Direttorju',
    topic: 'Suġġett',

    // Language switcher
    switchToEnglish: 'English',
    switchToMaltese: 'Malti',

    // Other
    searchShows: 'Fittex podcasts…',
    noShowsFound: 'Ma nstab l-ebda podcast. Taf b’xi wieħed nieqes?',
    backToAllShows: '← Lura għall-podcasts kollha',
    recentEpisodes: 'Episodji Riċenti',
    noEpisodes: 'Ma nstab l-ebda episodju riċenti.',
    by: 'minn',
    duration: 'min',
    hours: 'h',
    minutes: 'min',
    daysAgo: 'ġranet ilu',
    newEpisode: 'Episodju ġdid',
    featured: 'Rakkomandat',
    language: 'Lingwa',
    all: 'Kollha',
    maltese: 'Malti',
    english: 'English',
    bilingual: 'Bilingwi',
    topic: 'Suġġett',
    results: 'riżultati',
    show: 'podcast',
    shows: 'podcasts',
  },
  en: {
    // Navigation
    home: 'Home',
    shows: 'Shows',
    episodes: 'Episodes',
    submit: 'Submit',
    about: 'About',
    submitShow: '+ Submit Show',

    // Hero
    heroTitle: 'Podcasts<br/><em>from Malta.</em>',
    heroSub: 'Discover podcasts from the Maltese islands — in Maltese, English, and more.',
    heroStatsShows: 'shows',
    heroStatsUpdated: 'Updated every 6 hours',
    heroStatsFree: 'Free to list',
    browseAllShows: 'Browse All Shows',
    submitYourShow: 'Submit Your Show',

    // Sections
    latestEpisodes: 'Latest Episodes',
    seeAll: 'See all →',
    allShows: 'All Shows',
    browseDirectory: 'Browse directory →',

    // CTA
    gotPodcast: 'Got a podcast from Malta?',
    listHere: 'List it with us for free. Reach a Maltese audience looking for local content.',
    submitShow: 'Submit Your Show',

    // Footer
    madeWithLove: 'Made with ♥ in Malta 🇲🇹',
    discover: 'Discover',
    creators: 'Creators',
    getBadge: 'Get the Badge',
    aboutUs: 'About Us',
    contact: 'Contact',
    knowOne: 'Know one we\'re missing?',
    directory: 'Directory',
    topic: 'Topic',

    // Language switcher
    switchToEnglish: 'English',
    switchToMaltese: 'Malti',

    // Other
    searchShows: 'Search shows…',
    noShowsFound: 'No shows found. Know one we\'re missing?',
    backToAllShows: '← Back to all shows',
    recentEpisodes: 'Recent Episodes',
    noEpisodes: 'No recent episodes found.',
    by: 'by',
    duration: 'min',
    hours: 'h',
    minutes: 'min',
    daysAgo: 'days ago',
    newEpisode: 'New episode',
    featured: 'Featured',
    diaspora: 'Diaspora',
    language: 'Language',
    all: 'All',
    maltese: 'Malti',
    english: 'English',
    bilingual: 'Bilingual',
    topic: 'Topic',
    results: 'results',
    show: 'show',
    shows: 'shows',
  },
};

export function getTranslation(lang, key) {
  return translations[lang]?.[key] || translations.en[key] || key;
}

export function getCurrentLang() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('lang') || 'mt';
  }
  return 'mt'; // Default to Maltese
}

export function setCurrentLang(lang) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lang', lang);
  }
}