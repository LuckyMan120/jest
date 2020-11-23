import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '@category/_interfaces/category.interface';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Player } from '../../player/_interfaces/player.interface';
import { SeniorService } from '../senior.service';
import { Senior } from '../_interfaces/senior.interface';
import { CategoryService } from './../../category/category.service';
import { Member } from './../../member/_interfaces/member.interface';

@Component({

  selector: 'app-senior-detail',
  templateUrl: './senior-detail.component.html'
})
export class SeniorDetailComponent implements OnInit {

  senior$!: Observable<Senior | undefined>;
  assignedPlayer$!: Observable<Player>;
  assignedMember$!: Observable<Member>;
  category$!: Observable<Category | undefined>;

  constructor(
    public seniorService: SeniorService,
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private categoryService: CategoryService
  ) {
  }

  ngOnInit() {
    this.senior$ = this.route.params.pipe(
      switchMap(params => this.seniorService.get(params.seniorId)),
      tap((senior) => {
        this.assignedPlayer$ = this.seniorService.getAssignedPlayerOrMember('player', senior?.assignedPlayerId) as Observable<Player>;
        this.assignedMember$ = this.seniorService.getAssignedPlayerOrMember('member', senior?.assignedMemberId) as Observable<Member>;
        this.category$ = this.categoryService.get(senior.ahStatus as string);
      })
    );
  }

  deleteAssignedPlayer(senior: Senior): Promise<string> {
    return this.seniorService.deleteAssignedPlayerOrMember('players', senior);
  }

  deleteAssignedMember(senior: Senior): Promise<string> {
    return this.seniorService.deleteAssignedPlayerOrMember('members', senior);
  }

  deleteSenior(item: Senior): void {
    item.title = this.firestoreService.getUserTitle(item);
    return this.firestoreService.removeItem('seniors', item, '/seniors/list');
  }

}
