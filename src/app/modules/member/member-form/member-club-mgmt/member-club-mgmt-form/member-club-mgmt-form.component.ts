import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Category } from '../../../../category/_interfaces/category.interface';
import { ClubManagement } from '../../../../club/_interfaces/club-management.interface';
import { Member } from '../../../../member/_interfaces/member.interface';
import { CategoryService } from './../../../../category/category.service';
import { ClubManagementService } from './../../../../club/club-management/club-management.service';
import { MemberService } from './../../../member.service';

@Component({

  selector: 'app-member-club-mgmt-form',
  templateUrl: './member-club-mgmt-form.component.html',
  styleUrls: ['./member-club-mgmt-form.component.scss']
})
export class MemberClubMgmtFormComponent implements OnInit {

  @Output() toggleList: EventEmitter<void> = new EventEmitter();

  form!: FormGroup;
  hasFormErrors = false;

  categories$!: Observable<Category[]>;
  filteredMember$!: Observable<(Member | undefined)>;

  constructor(
    private clubManagementService: ClubManagementService,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.form = this.clubManagementService.getFormFields();

    this.filteredMember$ = this.route.params.pipe(
      switchMap(params => this.memberService.get(params.memberId)),
      map(member => {
        this.form.get('assignedMemberId')?.setValue(member?.id);
        return member;
      })
    );

    this.categories$ = this.categoryService.getCategoryListByParentCategoryTitle('Vereinsführung');
  }

  async onSubmit(): Promise<void> {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
    }
    await this.clubManagementService.save((this.form.value as ClubManagement));
    return this.toggleList.emit();
  }

}
