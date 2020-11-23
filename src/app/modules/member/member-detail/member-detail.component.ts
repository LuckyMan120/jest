import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Category } from '../../category/_interfaces/category.interface';
import { ClubHonorary } from '../../club/_interfaces/club-honorary.interface';
import { ClubManagement } from '../../club/_interfaces/club-management.interface';
import { MemberService } from '../member.service';
import { Member } from '../_interfaces/member.interface';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { CategoryService } from './../../category/category.service';
import { TeamService } from './../../team/team.service';
import { Team } from './../../team/_interfaces/team.interface';

@Component({

  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit {

  member$!: Observable<Member | undefined>;
  honorary$!: Observable<ClubHonorary | undefined>;

  clubManagements$!: Observable<ClubManagement[]>;
  externTeamMgmt$!: Observable<Team[]>;
  internTeamMgmt$!: Observable<Team[]>;
  category$!: Observable<Category | undefined>;

  constructor(
    public memberService: MemberService,
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private teamService: TeamService,
    private categoryService: CategoryService
  ) {
  }

  ngOnInit() {
    this.member$ = this.route.params.pipe(
      switchMap(params => this.memberService.get(params.memberId)),
      tap((member) => {
        if (member) {
          this.honorary$ = this.memberService.getHonoraryByMemberId(member.id);
          this.clubManagements$ = this.memberService.getClubManagementByMemberId(member.id);
          this.externTeamMgmt$ = this.teamService.getTeamManagementById('externMgmt', member.id);
          this.internTeamMgmt$ = this.teamService.getTeamManagementById('internMgmt', member.id);
          this.category$ = this.categoryService.get(member.clubStatus);
        }
      })
    );
  }

  deleteAssignedPlayerOrSenior(type: string, member: Member): Promise<string> {
    return this.memberService.deleteAssignedPlayerOrSenior(type, member);
  }

  deleteMember(item: Member): void {
    item.title = this.firestoreService.getUserTitle(item);
    return this.firestoreService.removeItem('members', item, '/members/list');
  }

}
