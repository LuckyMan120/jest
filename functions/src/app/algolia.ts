import algoliasearch, { SearchClient } from 'algoliasearch';
import { getConfig } from './../db';
import { createInfoMail } from './../shared/_classes/mail-engine';

export const initAlgolia = async (): Promise<SearchClient> => {
  const cfg = await getConfig();

  if (!cfg) {
    return null;
  }

  if (!cfg.algolia && cfg.mailjet) {
    return createInfoMail('Admin-Mailer', {
      Subject: 'Fehlende Algolia-Config',
      Variables: {
        text: `In den Einstellungen wurde keine Algolia-Konfiguration angelegt.`,
        title: 'Keine Algolia-Server-Konfiguration gefunden'
      }
    });
  }

  if (!cfg.algolia || cfg.algolia.disabled) {
    return null;
  }

  return algoliasearch(cfg.algolia.id, cfg.algolia.key);

};

export const validE164 = (num: any) => {
  return /^\+?[1-9]\d{1,14}$/.test(num);
};
