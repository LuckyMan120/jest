import { Player } from '@player/_interfaces/player.interface';
import * as moment from 'moment';
import { getUserTitle } from './../../../app-functions';
import { PlayerGR } from './../../_interfaces/player-gr.interface';
moment.locale('de');

export class PlayerFactory {

  public static getGermanDate(date: number | null, player: PlayerGR, type = 'other') {
    moment.locale('de');

    const utcOffset = moment(new Date()).utcOffset();
    // if (player.Name === 'Handle' && player.Vorname === 'Thomas' && type === 'birthDate') {
    const birthDate = moment(date, 'DD.MM.YYYY');
    birthDate.isDST() ? birthDate.add(utcOffset + 60, 'minutes') : birthDate.add(utcOffset, 'minutes');
    birthDate.utc(true);
    /* if (date && birthDate) {
      console.log(birthDate.toDate());
    } */
    return date ? birthDate.toDate().valueOf() : null;
  }

  public static fromPlayerGR(player: PlayerGR, user: any): Player {

    const timestamp = new Date().valueOf();
    // const utcOffset = moment(player.Geburtsdatum, 'DD.MM.YYYY').utcOffset();

    let guestPlayer: any = {};
    if (player?.['Gast/Zweitspielrecht']) {
      guestPlayer.guestRight = player?.['Gast/Zweitspielrecht'];
      guestPlayer.season = player?.Spielzeit;
      guestPlayer.type = player?.Spielart;
    } else {
      guestPlayer = null;
    }

    return {
      passNumber: player?.['Passnr.'],
      lastName: player?.Name,
      firstName: player?.Vorname,
      ageGroup: player.Altersklasse,
      assignedMemberId: null,
      assignedMemberTitle: null,
      assignedSeniorId: null,
      assignedSeniorTitle: null,
      birthDate: this.getGermanDate(player.Geburtsdatum, player, 'birthDate'),
      birthMonthDay: moment(player.Geburtsdatum, 'DD.MM.YYYY').format('MM-DD'), // .add(utcOffset, 'minutes')
      playerStatus: player?.Spielerstatus,
      gender: player?.Altersklasse && player.Altersklasse.indexOf('innen') > -1 ? 'weiblich' : 'männlich',
      guestPlayer,
      homeClub: player?.Stammverein,
      friendlyMatches: this.getGermanDate(player['Spielrecht Freundschaft / Privat'], player),
      officialMatches: this.getGermanDate(player['Spielrecht Freundschaft / Privat'], player),
      signOut: player?.Abmeldung ? this.getGermanDate(player?.Abmeldung, player) : null,
      passPrint: this.getGermanDate(player.Passdruck, player),
      status: player?.Einsetzbar,
      isImported: true,
      creation: { at: timestamp, by: 'System - GoogleDriveParser' },
      galleries: { Profilfotos: { title: 'Profilfotos' } },
      modification: [{ at: timestamp, by: 'System - GoogleDriveParser', changes: ['NEW'] }],
      // eslint-disable-next-line max-len
      publication: { at: new Date().valueOf(), by: user?.id, status: 1, user: { assignedRoles: user.assignedRoles, displayName: getUserTitle(user), photoUrl: user.photoUrl } },
      id: player?.['Passnr.'] + ''
    };
  }
}
