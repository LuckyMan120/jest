export const defaults = {
  algolia: {
    id: 'W5YXR7BD7M',
    key: '50853f0c724bef2ab6823706bcb75d43'
  },
  assignedCalendars: [
    {
      title: 'Allgemein',
      calendarId: '41q3u1q8pfh26dm1lpkuh7lsrs@group.calendar.google.com',
      manualAddingAllowed: true,
      isActive: true
    },
    {
      title: 'Geburtstage',
      calendarId: '0k8if9untaluq4pnbdbje3b4h8@group.calendar.google.com',
      manualAddingAllowed: false,
      isActive: true
    },
    {
      title: 'Spielplan',
      calendarId: '3kvpkut708lts5iu2disuv5ba4@group.calendar.google.com',
      manualAddingAllowed: true,
      isActive: true
    },
  ],
  categories: [
    { title: 'Homepage-Menü' },
    { title: 'Startseite', assignedCategoryTitles: ['Homepage-Menü'] },
    { title: 'Verein', assignedCategoryTitles: ['Homepage-Menü'] },
    { title: 'Mannschaften', assignedCategoryTitles: ['Homepage-Menü'] },
    { title: 'Kontakt', assignedCategoryTitles: ['Homepage-Menü'] },

    { title: 'E-Mail Verteiler' },
    { title: 'Geburtstagsgrüße', assignedCategoryTitles: ['E-Mail Verteiler'] },
    { title: 'Admin-Mailer', assignedCategoryTitles: ['E-Mail Verteiler'] },

    { title: 'News' },

    { title: 'Platzarten', parsingValues: ['Platzarten', 'Platzart'] },
    { title: 'Hartplätze', parsingValues: ['Hartplatz', 'Hartplätze'], assignedCategoryTitles: ['Platzarten'] },

    { title: 'Kunstrasenplätze', parsingValues: ['Kunstrasenplatz', 'Kunstrasenplätze'], assignedCategoryTitles: ['Platzarten'] },
    { title: 'Rasenplätze', parsingValues: ['Rasenplatz', 'Rasenplätze'], assignedCategoryTitles: ['Platzarten'] },

    { title: 'Hallen', parsingValues: ['Halle', 'Hallen', 'Mehrzweckhalle'], assignedCategoryTitles: ['Platzarten'] },

    { title: 'Mannschaftsarten' },
    { title: 'Senioren', assignedCategoryTitles: ['Mannschaftsarten'] },
    { title: 'Seniorinnen', assignedCategoryTitles: ['Mannschaftsarten'] },
    { title: 'Frauen', assignedCategoryTitles: ['Mannschaftsarten', 'Seniorinnen'] },
    { title: 'Herren', assignedCategoryTitles: ['Mannschaftsarten', 'Senioren'] },
    { title: 'Altherren-A Ü32', assignedCategoryTitles: ['Mannschaftsarten'] },
    { title: 'Altherren-D Ü60', assignedCategoryTitles: ['Mannschaftsarten'] },

    { title: 'Junioren', assignedCategoryTitles: ['Mannschaftsarten'] },
    { title: 'G-Junioren', assignedCategoryTitles: ['Mannschaftsarten', 'Junioren'] },
    { title: 'F-Junioren', assignedCategoryTitles: ['Mannschaftsarten', 'Junioren'] },
    { title: 'E-Junioren', assignedCategoryTitles: ['Mannschaftsarten', 'Junioren'] },
    { title: 'D-Junioren', assignedCategoryTitles: ['Mannschaftsarten', 'Junioren'] },
    { title: 'C-Junioren', assignedCategoryTitles: ['Mannschaftsarten', 'Junioren'] },
    { title: 'B-Junioren', assignedCategoryTitles: ['Mannschaftsarten', 'Junioren'] },
    { title: 'A-Junioren', assignedCategoryTitles: ['Mannschaftsarten', 'Junioren'] },

    { title: 'Sponsoring-Arten' },
    { title: 'Bandenwerbung', assignedCategoryTitles: ['Sponsoring-Arten'] },
    { title: 'Vereinsheft SFW Echo', assignedCategoryTitles: ['Sponsoring-Arten'] },
    { title: 'Werbung auf der Homepage', assignedCategoryTitles: ['Sponsoring-Arten'] },
    { title: 'Werbung in soz. Netzwerken', assignedCategoryTitles: ['Sponsoring-Arten'] },

    { title: 'Vereinsführung' },
    { title: '1. Vorsitzender', assignedCategoryTitles: ['Vereinsführung'] },
    { title: '2. Vorsitzender', assignedCategoryTitles: ['Vereinsführung'] },
    { title: '1. Kassierer', assignedCategoryTitles: ['Vereinsführung'] },
    { title: '2. Kassierer', assignedCategoryTitles: ['Vereinsführung'] },
    { title: 'Pressewart', assignedCategoryTitles: ['Vereinsführung'] },
    { title: 'Spartenleiter Aktive', assignedCategoryTitles: ['Vereinsführung'] },

    { title: 'Dateikategorien' },
    { title: 'Fotos', assignedCategoryTitles: ['Dateikategorien'] },
    { title: 'Dokumente', assignedCategoryTitles: ['Dateikategorien'] },
    { title: 'Videos', assignedCategoryTitles: ['Dateikategorien'] },
    { title: 'Audio', assignedCategoryTitles: ['Dateikategorien'] },
    { title: 'Sonstige', assignedCategoryTitles: ['Dateikategorien'] },

    { title: 'Artikelfotos', assignedCategoryTitles: ['Dateikategorien', 'Fotos'] },
    { title: 'Spieler oder Mitgliederfotos', assignedCategoryTitles: ['Dateikategorien', 'Fotos'] },
    { title: 'Sponsoren-Ansprechpartner', assignedCategoryTitles: ['Dateikategorien', 'Fotos'] },
    { title: 'Mannschaftsfotos', assignedCategoryTitles: ['Dateikategorien', 'Fotos'] },
    { title: 'Vereins-Wappen', assignedCategoryTitles: ['Dateikategorien', 'Fotos'] },
    { title: 'Sponsoren-Logos', assignedCategoryTitles: ['Dateikategorien', 'Fotos'] },

    { title: 'Links' },
    { title: 'Links zu sozialen Netzwerken', assignedCategoryTitles: ['Links'] },
    { title: 'Externe Footerlinks', assignedCategoryTitles: ['Links'] },

    { title: 'Verein' },

    { title: 'Mannschaftsinterne Aufgaben', parsingValues: ['internMgmt'] },
    { title: 'Spielführer', assignedCategoryTitles: ['Mannschaftsinterne Aufgaben'] },
    { title: '2. Spielführer', assignedCategoryTitles: ['Mannschaftsinterne Aufgaben'] },

    { title: 'Aufgaben in der Mannschaftsleitung', parsingValues: ['externMgmt'] },
    { title: 'Trainer', assignedCategoryTitles: ['Aufgaben in der Mannschaftsleitung'] },
    { title: 'Co-Trainer', assignedCategoryTitles: ['Aufgaben in der Mannschaftsleitung'] },
    { title: 'Betreuer', assignedCategoryTitles: ['Aufgaben in der Mannschaftsleitung'] },

    { title: 'Dorfturniermannschaften', assignedCategoryTitles: ['Mannschaftsarten'] },
    { title: 'Aktive Frauenmannschaften', assignedCategoryTitles: ['Dorfturniermannschaften', 'Mannschaftsarten'] },
    { title: 'Aktive Herrenmannschaften', assignedCategoryTitles: ['Dorfturniermannschaften', 'Mannschaftsarten'] },
    { title: 'Inaktive Herrenmannschaften', assignedCategoryTitles: ['Dorfturniermannschaften', 'Mannschaftsarten'] },
    { title: 'Mixed-Mannschaften', assignedCategoryTitles: ['Dorfturniermannschaften', 'Mannschaftsarten'] },

    { title: 'Mitgliederarten' },
    { title: 'Vereinsmitglieder', parsingValues: ['verein'], assignedCategoryTitles: ['Mitgliederarten'] },
    { title: 'AH-Mitglieder', parsingValues: ['altherren'], assignedCategoryTitles: ['Mitgliederarten'] },

    { title: 'unbekannt', parsingValues: ['unbekannt'], assignedCategoryTitles: ['Mitgliederarten', 'Vereinsmitglieder'] },
    { title: 'kein Mitglied', parsingValues: ['kein-mitglied'], assignedCategoryTitles: ['Mitgliederarten', 'Vereinsmitglieder'] },
    { title: 'Mitglied', parsingValues: ['mitglied'], assignedCategoryTitles: ['Mitgliederarten', 'Vereinsmitglieder'] },
    { title: 'Kinder', parsingValues: ['kinder'], assignedCategoryTitles: ['Mitgliederarten', 'Vereinsmitglieder'] },
    { title: 'Jugendliche', parsingValues: ['jugendliche'], assignedCategoryTitles: ['Mitgliederarten', 'Vereinsmitglieder'] },
    { title: 'Familien', parsingValues: ['familien'], assignedCategoryTitles: ['Mitgliederarten', 'Vereinsmitglieder'] },
    { title: 'Turnen', parsingValues: ['turner'], assignedCategoryTitles: ['Mitgliederarten', 'Vereinsmitglieder'] },
    { title: 'Beitragsfrei', parsingValues: ['beitragsfrei'], assignedCategoryTitles: ['Mitgliederarten', 'Vereinsmitglieder'] },

    { title: 'unbekannt', parsingValues: ['unbekannt'], assignedCategoryTitles: ['Mitgliederarten', 'AH-Mitglieder'] },
    { title: 'kein Mitglied', parsingValues: ['kein-mitglied'], assignedCategoryTitles: ['Mitgliederarten', 'AH-Mitglieder'] },
    { title: 'Mitglied', parsingValues: ['mitglied'], assignedCategoryTitles: ['Mitgliederarten', 'AH-Mitglieder'] },
    { title: 'Ehrenmitglieder', parsingValues: ['ehrenmitglieder'], assignedCategoryTitles: ['Mitgliederarten', 'AH-Mitglieder'] },
  ],
  // dunkelblau, orange, rot, türkis, grün, grau, pink, lila
  colors: ['#130F9E', '#ff6600', '#CC0000', '#3f919a', '#33CC00', '#333333', '#ff005d', '#ff00ff'],
  communities: [
    'SG SF Winterbach', 'SF Winterbach', 'SG Winterbach', 'SG Winterbach/Bliesen',
    'SG SV Bliesen', 'SG Schaumberg', 'SG FC Gronig', 'SG SV Oberthal', 'SG VfB Theley'
  ],
  dfbnet: {
    username: '43141970-01',
    password: 'SFW-2020'
  },
  fussball: {
    clubId: '00ES8GNBEO00001UVV0AG08LVUPGND5I',
    endDateOffset: 3,
    startDate: undefined
  },
  mailing: [
    {
      isActive: true,
      assignedCategoryTitle: 'Admin-Mailer',
      emails: ['Thomas.handle@gmail.com', 't.handle@lzd.saarland.de']
    },
    {
      isActive: true,
      assignedCategoryTitle: 'Geburtstagsgrüße',
      emails: ['Thomas.handle@gmail.com', 't.handle@lzd.saarland.de', 'mail@r-klein.com']
    }
  ],
  mailjet: {
    key: '0393e6aac331b1aaf17aa97034a36065',
    secret: '0f4acbe2a1a7d1bad9dc0dfebe59b4fa'
  },
  memberSheetId: '1R-0p6YbcqRHe-fplBDE4w6Cu56NF82LgosXFHbSUIRA',
  permissions: [
    'Benutzer', 'Benutzer-Berechtigungen', 'Benutzer-Rollen'
    , 'Einstellungen', 'Adminzugang', 'Kategorien'
    , 'Dateiverwaltung', 'Gallerien-erstellen', 'Gallerien-editieren'
    , 'Gallerien-löschen', 'Artikel', 'Artikel-erstellen'
    , 'Artikel-editieren', 'Artikel-löschen', 'Spiele'
    , 'Spiele-erstellen', 'Spiele-editieren', 'Spiele-löschen'
    , 'Newsletter', 'Newsletter-versenden', 'Verein'
    , 'Verein-Ehrenmitglieder', 'Verein-Vorstand', 'Verein-Zeitleiste'
    , 'Mitglieder', 'Mitglieder-erstellen', 'Mitglieder-editieren'
    , 'Mitglieder-löschen', 'Spieler', 'Spieler-erstellen'
    , 'Spieler-editieren', 'Spieler-löschen', 'Altherren'
    , 'Altherren-erstellen', 'Altherren-editieren', 'Altherren-löschen'
    , 'Mannschaften', 'Mannschaften-erstellen', 'Mannschaften-editieren'
    , 'Mannschaften-löschen', 'Treffpunkte', 'Treffpunkte-erstellen'
    , 'Treffpunkte-editieren', 'Treffpunkte-löschen',
    'Sponsoren', 'Sponsoren-erstellen', 'Sponsoren-editieren', 'Sponsoren-löschen'
  ],
  roles: ['Administrator', 'Gast', 'Trainer', 'Spieler'],
  slackWebHookUrl: 'https://hooks.slack.com/services/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',
  site: {
    author: 'Thomas Handle',
    backendUrl: 'https://admin.sfwinterbach.com',
    description: 'Nordsaarländischer Amateurverein mit den Sparten Fußball, Turnen und E-Sport',
    frontendUrl: 'https://sfwinterbach.com',
    email: 'info@sfwinterbach.com',
    keywords: 'Fußball, Amateure, Saarland, Saar-FV, Winterbach, Sportfreunde, Verein',
    logo: '/assets/icons/icon-128x128.png',
    subTitle: 'Sportfreunde Winterbach e.V.',
    title: 'SF Winterbach e.V.'
  },
  uppy: {
    companionUrl: 'https://uppy-gztlbjk4aa-ey.a.run.app',
    facebook: true,
    instagram: true,
    googleDrive: true,
    oneDrive: false,
    zoom: false,
    dropbox: true,
    url: true,
    unsplash: true
  }
};
