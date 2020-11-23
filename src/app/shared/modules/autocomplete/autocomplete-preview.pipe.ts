import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '@article/_interfaces/article.interface';
import { Category } from '@category/_interfaces/category.interface';
import { Location } from '@location/_interfaces/location.interface';
import { Match } from '@match/_interfaces/match.interface';
import { Member } from '@member/_interfaces/member.interface';
import { Player } from '@player/_interfaces/player.interface';
import { Senior } from '@senior/_interfaces/senior.interface';
import { Team } from '@team/_interfaces/team.interface';
import { User } from '@user/_interfaces/user.interface';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from './../../services/firestore.service';

@Pipe({
  name: 'preview'
})
export class AutocompletePreviewPipe implements PipeTransform {

  constructor(
    private firestoreService: FirestoreService
  ) { }

  transform(
    value: string,
    type: string = 'articles' || 'categories' || 'locations' || 'matches' || 'members' || 'players' || 'seniors' || 'teams' || 'users'
  ): Observable<any> {
    switch (type) {
      case 'articles':
      case 'categories':
      case 'locations':
        return this.firestoreService.doc$<Article | Category | Location>(`/${type}/${value}`).pipe(map(a => a ? a.title : null));
      case 'members':
      case 'players':
      case 'seniors':
      case 'users':
        return this.firestoreService.doc$<Member | Player | Senior | User>(`/${type}/${value}`).pipe(
          map(m => m ? this.firestoreService.getUserTitle(m) : null)
        );
      case 'matches':
        return this.firestoreService.doc$<Match>(`/${type}/${value}`).pipe(
          map(m => m ? `${m.playersType}: ${m.homeTeam?.title} - ${m.guestTeam?.title}` : null)
        );
      case 'teams':
        return this.firestoreService.doc$<Team>(`/${type}/${value}`).pipe(
          map(m => m ? `${m.title} ${m.subTitle} (${m.assignedSeasonTitle})` : null)
        );
      default:
        return of(null);
    }
  }

}
