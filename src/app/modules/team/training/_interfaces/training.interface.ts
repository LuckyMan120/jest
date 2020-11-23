import { Location } from '../../../location/_interfaces/location.interface';
import { Team } from '../../_interfaces/team.interface';
import { Season } from './../../../../shared/_interfaces/season.interface';

export interface Training {

  id?: string;
  title: string;

  assignedSeasonId: string;
  assignedSeasonTitle?: Season;

  assignedLocationId: string;
  assignedLocationTitle?: Location;

  assignedTeamIds: string[];
  assignedTeamTitles?: Team[];

  day: number;
  startTime: number | Date;
  startSlot?: string;
  endTime: number | Date;
  endSlot?: string;

  comment: string;
}
