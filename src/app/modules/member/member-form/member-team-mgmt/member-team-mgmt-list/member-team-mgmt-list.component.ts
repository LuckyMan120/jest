import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { TeamService } from './../../../../team/team.service';
import { TeamExternManagement } from './../../../../team/_interfaces/team-management.interface';
import { Team } from './../../../../team/_interfaces/team.interface';
import { MemberService } from './../../../member.service';
import { Member } from './../../../_interfaces/member.interface';

@Component({

  selector: 'app-member-team-mgmt-list',
  templateUrl: './member-team-mgmt-list.component.html',
  styleUrls: ['./member-team-mgmt-list.component.scss']
})
export class MemberTeamMgmtListComponent implements OnInit {

  @Output() toggleList: EventEmitter<void> = new EventEmitter();

  teams$!: Observable<Team[]>;
  member$!: Observable<Member | undefined>;

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.member$ = this.route.params.pipe(
      switchMap((params: any) => this.memberService.get(params.memberId)),
      tap(member => this.teams$ = this.teamService.getTeamManagementById('externMgmt', member?.id))
    );
  }

  removeTeamMgmtPosition(team: Team, mgmt: TeamExternManagement): Promise<string> {
    return this.teamService.removeTeamMgmtPosition('externMgmt', team, mgmt);
  }

}
