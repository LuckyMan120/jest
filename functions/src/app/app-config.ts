export const TIME_ZONE = 'CET';
export const MAILJET_TEMPLATES = { admin: 1216942, birthday: 1216928 };

export const DEFAULT_ADMIN_CONTACTS = [
  { Name: 'Thomas Handle', Email: 'Thomas.handle@gmail.com' },
  { Name: 'Sportfreunde', Email: '43sfwinterbach@saar-fv.evpost.de' }
];

export const publicationStates: { id: number, title: string }[] = [
  { id: 0, title: 'draft' },
  { id: 1, title: 'published' },
  { id: 2, title: 'planned' }
];
