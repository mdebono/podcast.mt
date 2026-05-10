// src/lib/i18n.js
// Simple i18n for Maltese (MT) and English (EN)

const translations = {
  mt: {
    nav: {
      home: 'Dar',
      shows: 'Podcasts',
      episodes: 'Episodi',
      submit: 'Żid',
      about: 'Dwar',
      submitShow: '+ Żid Podcast',
    },
    hero: {
      title: 'Poddati<br/><em>minn Malta.</em>',
      sub: 'Skopri podcasts mill-gżejjer Maltin — bil-Malti, bl-Ingliż, u aktar.',
      stats: {
        shows: 'podcasts',
        updated: 'Aġġornat kull 6 sigħat',
        free: 'B’xejn biex tniżżel',
      },
      browseAllShows: 'Ara l-Podcasts Kollha',
      submitYourShow: 'Żid il-Podcast Tiegħek',
    },
    sections: {
      latestEpisodes: 'Episodji Riċenti',
      seeAll: 'Ara kollox →',
      allShows: 'Podcasts',
      browseDirectory: 'Iftaħ id-direttorju →',
      recentEpisodes: 'Episodji Riċenti',
    },
    cta: {
      gotPodcast: 'Għandek podcast Malti?',
      listHere: 'Żidu magħna b’xejn. Ilħaq udjenza Maltija li qed tfittex kontenut lokali.',
      submitShow: 'Żid il-Podcast Tiegħek',
    },
    footer: {
      madeWithLove: 'Magħmul b’imħabba f’Malta 🇲🇹',
      discover: 'Skopri',
      creators: 'Produtturi',
      getBadge: 'Ikseb il-Badge',
      aboutUs: 'Dwarna',
      contact: 'Kuntatt',
    },
    language: {
      switchToEnglish: 'English',
      switchToMaltese: 'Malti',
      label: 'Lingwa',
      all: 'Kollha',
      maltese: 'Malti',
      english: 'English',
      bilingual: 'Bilingwi',
    },
    filters: {
      searchShows: 'Fittex podcasts…',
      noShowsFound: 'Ma nstab l-ebda podcast. Taf b’xi wieħed nieqes?',
      knowOne: 'Xi ħaġa nieqsa?',
      directory: 'Direttorju',
      topic: 'Suġġett',
      all: 'Kollha',
    },
    misc: {
      by: 'minn',
      duration: 'min',
      hours: 'h',
      minutes: 'min',
      daysAgo: 'ġranet ilu',
      newEpisode: 'Episodju ġdid',
      featured: 'Rakkomandat',
      diaspora: 'Dijaspora',
      results: 'riżultati',
      show: 'podcast',
      shows: 'podcasts',
      backToAllShows: '← Lura għall-podcasts kollha',
      noEpisodes: 'Ma nstab l-ebda episodju riċenti.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      shows: 'Shows',
      episodes: 'Episodes',
      submit: 'Submit',
      about: 'About',
      submitShow: '+ Submit Show',
    },
    hero: {
      title: 'Podcasts<br/><em>from Malta.</em>',
      sub: 'Discover podcasts from the Maltese islands — in Maltese, English, and more.',
      stats: {
        shows: 'shows',
        updated: 'Updated every 6 hours',
        free: 'Free to list',
      },
      browseAllShows: 'Browse All Shows',
      submitYourShow: 'Submit Your Show',
    },
    sections: {
      latestEpisodes: 'Latest Episodes',
      seeAll: 'See all →',
      allShows: 'All Shows',
      browseDirectory: 'Browse directory →',
      recentEpisodes: 'Recent Episodes',
    },
    cta: {
      gotPodcast: 'Got a podcast from Malta?',
      listHere: 'List it with us for free. Reach a Maltese audience looking for local content.',
      submitShow: 'Submit Your Show',
    },
    footer: {
      madeWithLove: 'Made with ♥ in Malta 🇲🇹',
      discover: 'Discover',
      creators: 'Creators',
      getBadge: 'Get the Badge',
      aboutUs: 'About Us',
      contact: 'Contact',
    },
    language: {
      switchToEnglish: 'English',
      switchToMaltese: 'Malti',
      label: 'Language',
      all: 'All',
      maltese: 'Malti',
      english: 'English',
      bilingual: 'Bilingual',
    },
    filters: {
      searchShows: 'Search shows…',
      noShowsFound: 'No shows found. Know one we\'re missing?',
      knowOne: 'Know one we\'re missing?',
      directory: 'Directory',
      topic: 'Topic',
      all: 'All',
    },
    misc: {
      by: 'by',
      duration: 'min',
      hours: 'h',
      minutes: 'min',
      daysAgo: 'days ago',
      newEpisode: 'New episode',
      featured: 'Featured',
      diaspora: 'Diaspora',
      results: 'results',
      show: 'show',
      shows: 'shows',
      backToAllShows: '← Back to all shows',
      noEpisodes: 'No recent episodes found.',
    },
  },
};

function getNestedTranslation(lang, key) {
  return key.split('.').reduce((obj, part) => obj?.[part], translations[lang]);
}

export function getTranslation(lang, key) {
  const value = getNestedTranslation(lang, key);
  if (typeof value === 'string') return value;

  const fallback = getNestedTranslation('en', key);
  return typeof fallback === 'string' ? fallback : key;
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
