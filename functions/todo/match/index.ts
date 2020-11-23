import * as admin from 'firebase-admin';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import * as moment from 'moment';
import * as db from '../db';
import { MailEngine } from '../shared/_classes/mail-engine';
import { DEFAULT_ADMIN_CONTACTS, MAILJET_TEMPLATES } from './../app/app-config';
import { MatchReminder } from './../shared/_interfaces/match-reminder.interface';
import { Match } from './../shared/_interfaces/match.interface';
import { Team } from './../shared/_interfaces/team.interface';
moment.locale('de');

export * from './match-create';
export * from './match-delete';
export * from './match-update';
// export * from './match-write';

export const matchResultReminder = async () => {

  const currentApp = await db.currentApplication();
  const mailList = currentApp.data()?.mailing.find((mailing: any) => mailing.isActive && mailing.title === 'Ergebnis-Reminder');
  const noMatchesWithoutResult = 'Es wurden keine Spiele ohne fehlendes Ergebnis gefunden.';

  const matches = await admin.firestore()
    .collection('matches')
    .where('matchStartDate', '<', new Date().valueOf())
    .where('isCompleted', '==', false)
    .where('isOfficialMatch', '==', true)
    .orderBy('matchStartDate').get();

  let responseList: MatchReminder[] = [];

  if (!matches.empty) {

    responseList = matches.docs.map((doc: DocumentSnapshot) => {
      const match = doc.data() as Match;
      const homeTeam = match.homeTeam as Team;
      const guestTeam = match.guestTeam as Team;
      const matchDate = moment(match.matchStartDate).format('LLL');
      return {
        title: match.playersType + ': ' + homeTeam.title + ' - ' + guestTeam.title,
        matchStartDate: match.matchStartDate,
        id: match.id,
        formattedDate: matchDate,
        externalLink: match.matchLink
      };
    });

    let text = responseList.map((match: MatchReminder) => {
      return `<li><a href="">${match.title} vom ${match.formattedDate} Uhr'</a> (<a target="_blank" href="${match.externalLink}">fussball.de</a>)</li>`;
    }).join('');
    text = `<ul>${text}</ul>`

    await new MailEngine().sendMail({
      Subject: 'Fehlende Spielergebnisse',
      To: mailList.emails || DEFAULT_ADMIN_CONTACTS,
      TemplateId: MAILJET_TEMPLATES.admin,
      Variables: {
        intro: 'Für die folgenden Spiele wurden noch kein Ergebnis eingetragen:',
        text,
        title: 'Ergebnismeldung erforderlich',
        more: 'Bitte melde Dich im Adminbereich an und melde die Ergebnisse. Vielen Dank!'
      }
    });
  } else {
    await new MailEngine().sendMail({
      Subject: 'Fehlende Spielergebnisse',
      To: mailList.emails || DEFAULT_ADMIN_CONTACTS,
      TemplateId: MAILJET_TEMPLATES.admin,
      Variables: {
        intro: noMatchesWithoutResult,
        title: 'Ergebnismeldung',
      }
    });
  }

  return responseList || noMatchesWithoutResult;
}

/*
export const updateMatchStatistics = (teamId: string, isHomeTeam: boolean, isOtherEvent: boolean, matchResult: result, increment: FieldValue) => {

  const valueToUpdate: any = {};
  valueToUpdate['total'] = { otherEvents: {} };
  valueToUpdate[teamId] = { otherEvents: {} };

  if (isOtherEvent && matchResult.otherEvent) {
    valueToUpdate['total']['otherEvents'][matchResult.otherEvent] = increment;
    valueToUpdate[teamId]['otherEvents'][matchResult.otherEvent] = increment;
  } else {
    if (matchResult) {
      if ((isHomeTeam && matchResult && matchResult.homeTeamGoals > matchResult.guestTeamGoals) || (!isHomeTeam && matchResult.homeTeamGoals < matchResult.guestTeamGoals)) {
        valueToUpdate['total'].won = increment;
        valueToUpdate[teamId].won = increment;
      }
      if ((isHomeTeam && matchResult.homeTeamGoals < matchResult.guestTeamGoals) || (!isHomeTeam && matchResult.homeTeamGoals > matchResult.guestTeamGoals)) {
        valueToUpdate['total'].lost = increment;
        valueToUpdate[teamId].lost = increment;
      }
      if (matchResult.homeTeamGoals === matchResult.guestTeamGoals) {
        valueToUpdate['total'].draw = increment;
        valueToUpdate[teamId].draw = increment;
      }
    }
  }

  return admin.firestore().collection('statistics').doc('match-statistics').set({ ...valueToUpdate }, { merge: true });
} */
