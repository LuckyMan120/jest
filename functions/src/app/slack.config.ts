import { getConfig } from './../db';
import { createInfoMail } from './../shared/_classes/mail-engine';
const IncomingWebhook = require('@slack/webhook').IncomingWebhook;

export const sendToWebHook = async (message: any): Promise<void | { type: string, url: string }> => {
  const cfg = await getConfig();

  if (!cfg.slackWebHookUrl) {
    console.log('no webhooks defined');
    return createInfoMail('Admin-Mailer', {
      Subject: 'Fehlende Slack-Config',
      Variables: {
        text: `In den Einstellungen wurde keine Konfiguration zum Versenden von Nachrichten an einen Slack-Server angelegt.`,
        title: 'Keine Slack-Server-Konfiguration gefunden'
      }
    });
  }

  const slack = new IncomingWebhook(cfg.slackWebHookUrl);
  return slack.send(message);

};
