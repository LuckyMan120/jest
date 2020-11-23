import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from './../../../../../shared/services/firestore.service';
import { CategoryService } from './../../../../category/category.service';
import { Category } from './../../../../category/_interfaces/category.interface';
import { TeamService } from './../../../../team/team.service';
import { Team } from './../../../../team/_interfaces/team.interface';
import { MemberService } from './../../../member.service';

@Component({

  selector: 'app-member-team-mgmt-form',
  templateUrl: './member-team-mgmt-form.component.html',
  styleUrls: ['./member-team-mgmt-form.component.scss']
})
export class MemberTeamMgmtFormComponent implements OnInit {

  @Output() toggleList: EventEmitter<void> = new EventEmitter();

  form!: FormGroup;
  hasFormErrors = false;

  categories$!: Observable<Category[]>;
  memberId!: string | undefined;
  memberId$!: Observable<string>;
  teams$!: Observable<Team[]>;

  constructor(
    private categoryService: CategoryService,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private teamService: TeamService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit(): void {
    this.form = this.memberService.getMemberTeamPositionFormFields();

    this.memberId$ = this.route.params.pipe(
      switchMap(params => params.memberId as string),
      tap(id => this.memberId = id)
    );

    this.categories$ = this.categoryService.getCategoryListByParentCategoryTitle(`Aufgaben in der Mannschaftsleitung`);
    this.teams$ = this.firestoreService.col<Team>(`teams`).valueChanges();
  }

  public get assignedTeamControl() {
    return this.form.controls.teamId;
  }

  public get assignedCategoryControl() {
    return this.form.controls.assignedCategoryId;
  }

  onSubmit(): void {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.teamService.createTeamManagement('externMgmt', { ...this.form.getRawValue(), assignedMemberId: this.memberId }).then(
      () => this.toggleList.emit()
    );
  }

}
