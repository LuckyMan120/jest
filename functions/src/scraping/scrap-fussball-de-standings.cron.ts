import * as functions from 'firebase-functions';

const _cronScrapStandings = functions
  .region('europe-west1')
  .runWith({ memory: '2GB', timeoutSeconds: 60 })
  .pubsub.schedule('20 5 * * *') // Cron at 05:20.
  .timeZone('Europe/Berlin')
  .onRun(async () => {

    /* const currentApp = await currentApplication();
    const mailer = currentApp.data()?.mailing.filter((mailing: any) => mailing.isActive && mailing.title === 'Admin-Mailer');

    try {

      const result = await new FussballImporter().importStandings();
      await new MailEngine().sendReminderToAdmins(mailer[0].emails,
        'Tabellenstände von fussball.de', 'Automatischer Tabellenstand-Import', '', result);
      await NotificationEngine.sendSlackNotification(`[cronScrapStandings]
      ${result.teams.length} Tabellen für die Saison ${result.season} wurden per Cronjob importiert.`);
      return `[cronScrapStandings] ${result.teams.length} Tabellen für die Saison ${result.season} wurden per Cronjob importiert.`;

    } catch (e) {

      await NotificationEngine.sendSlackNotification(`[cronScrapStandings] ${e.message}`);
      await new MailEngine().sendReminderToAdmins(mailer[0].emails,
        'Tabellenstände von fussball.de', 'FEHLER: Automatischer Tabellenstand-Import', '', e.message);
      return e;

    } */

  });

export const cronScrapStandings = _cronScrapStandings;
