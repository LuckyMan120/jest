import { Team } from '../../team/_interfaces/team.interface';
import { MatchResult } from './match.interface';

export interface MatchStatistics {
    club: {
        stats: MatchStats;
        clubMatchCount: number;
    };
    matches: {
        matchId: string;
        assignedTeam: string;
        homeTeam: Team | 'spielfrei';
        guestTeam: Team | 'spielfrei';
        result: MatchResult;
    }[];
    seasons: {
        seasonId: string
        stats: MatchStats;
        seasonMatchCount: number;
    }[];
    teams: TeamStats[];
}

export interface TeamStats {
    teamId: string;
    stats: MatchStats;
    teamMatchCount: number;
}

export interface MatchStats {
    draw: number;
    lost: number;
    won: number;
}
