import { Match } from '@match/_interfaces/match.interface';
import { Season } from '@shared/_interfaces/season.interface';
import * as slack from '@slack/client';
import { Team } from '@team/_interfaces/team.interface';
import * as functions from 'firebase-functions';
import * as util from 'util';
import { Whatsapp } from '../_interfaces/whatsapp.interface';

export class NotificationEngine {
  public static async notifyNewUser(user: any, reason?: string | undefined, forReview: boolean = false) {
    const notification = { user, reason, forReview };
    return NotificationEngine.createNotification(notification);
  }
  public static async notifyNewTeam(team: Team, reason?: string | undefined, forReview: boolean = false) {
    const notification = { team, reason, forReview };
    return NotificationEngine.createNotification(notification);
  }
  public static async notifyNewSeason(season: Season, reason?: string | undefined, forReview: boolean = false) {
    const notification = { season, reason, forReview };
    return NotificationEngine.createNotification(notification);
  }
  public static async notifyNewMatch(match: Match, reason?: string | undefined, forReview: boolean = false) {
    const notification = { match, reason, forReview };
    util.inspect(match);
    util.inspect(reason);
    return NotificationEngine.createNotification(notification);
  }
  public static async notifyMatchWithoutResult(match: Match, reason?: string | undefined, forReview: boolean = false) {
    const notification = { match, reason, forReview };
    util.inspect(match);
    return NotificationEngine.createNotification(notification);
  }
  public static async notifyWhatsappMessage(whatsapp: Whatsapp, reason?: string | undefined, forReview: boolean = false) {
    console.log('New whatsapp notification');
  }
  public static async notifySystemError(e: Error, reason?: string | undefined, forReview: boolean = false) {
    const notification = { e, reason, forReview };
    return NotificationEngine.createNotification(notification);
  }
  public static async notifyAdminError(e: string, reason?: string | undefined, forReview: boolean = false) {
    const notification = { e, reason, forReview };
    return NotificationEngine.createNotification(notification);
  }
  public static async notifyNoBirthdays(reason?: string | undefined, forReview: boolean = false) {
    const notification = { reason, forReview };
    return NotificationEngine.createNotification(notification);
  }
  public static async notifyBirthdays(list: string, reason?: string | undefined, forReview: boolean = false) {
    const notification = { list, reason, forReview };
    return NotificationEngine.createNotification(notification);
  }
  public static async sendSlackNotification(message: string) {
    const url = functions.config().slack.webhook;
    const webhook = new slack.IncomingWebhook(url);
    return NotificationEngine.sendMessage2Slack(webhook, message);
  }
  private static createNotification(notification: any) {
    // ToDo: Notification Mgmt
    return Promise.resolve(); // admin.firestore().collection('notifications').doc().create(notification);
  }
  private static sendMessage2Slack(webhook: any, message: string) {
    return webhook.send(message);
  }
}
