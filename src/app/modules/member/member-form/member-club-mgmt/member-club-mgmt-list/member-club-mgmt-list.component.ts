import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Member } from '../../../_interfaces/member.interface';
import { FirestoreService } from './../../../../../shared/services/firestore.service';
import { ClubManagement } from './../../../../club/_interfaces/club-management.interface';
import { MemberService } from './../../../member.service';

@Component({

  selector: 'app-member-club-mgmt-list',
  templateUrl: './member-club-mgmt-list.component.html',
  styleUrls: ['./member-club-mgmt-list.component.scss']
})
export class MemberClubMgmtListComponent implements OnInit {

  @Output() toggleList: EventEmitter<void> = new EventEmitter();

  member$!: Observable<Member>;
  mgmt$!: Observable<ClubManagement[]>;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit(): void {
    this.mgmt$ = this.route.params.pipe(
      switchMap((params: any) => this.memberService.getClubManagementByMemberId(params.memberId))
    );
  }

  removeMgmtPosition(mgmt: ClubManagement): void {
    return this.firestoreService.removeItem('club-management', mgmt, 'club-management');
  }

}
