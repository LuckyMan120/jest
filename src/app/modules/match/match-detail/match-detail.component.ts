import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatchService } from '../match.service';
import { Match } from '../_interfaces/match.interface';
import { FirestoreService } from './../../../shared/services/firestore.service';
@Component({

  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.scss']
})
export class MatchDetailComponent implements OnInit {

  public match!: Match;
  public match$!: Observable<Match>;

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit() {
    this.match$ = this.route.params.pipe(
      switchMap(params => this.matchService.get(params.matchId))
    );
  }

  deleteMatch(match: Match) {
    this.firestoreService.removeItem('matches', match, 'match', '/matches/list');
  }

}
