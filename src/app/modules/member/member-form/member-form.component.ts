import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Category } from '../../category/_interfaces/category.interface';
import { ClubHonorary } from '../../club/_interfaces/club-honorary.interface';
import { MemberService } from '../member.service';
import { Member } from '../_interfaces/member.interface';
import { FirestoreService } from './../../../shared/services/firestore.service';
import { CategoryService } from './../../category/category.service';

@Component({

  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.scss']
})
export class MemberFormComponent implements OnInit {

  member$!: Observable<Member | undefined>;
  honorary$!: Observable<ClubHonorary>;

  form!: FormGroup;
  savedMember!: Member;
  clubMemberStates$!: Observable<Category[]>;

  hasFormErrors = false;

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService,
    private categoryService: CategoryService
  ) {
  }

  ngOnInit() {
    this.form = this.memberService.getMemberFormFields();

    this.member$ = this.route.params.pipe(
      switchMap(params => this.memberService.get(params.memberId)),
      tap((member: Member | undefined) => {
        if (member) {
          this.form.patchValue(member);
          this.savedMember = Object.freeze(Object.assign({}, member));
          /* if (member.id) {
            this.form.get('firstName')?.disable();
            this.form.get('lastName')?.disable();
            if (member.birthDate) {
              this.form.get('birthDate')?.disable();
            }
          } */
        }
      })
    );

    this.clubMemberStates$ = this.categoryService.getCategoryListByParentCategoryTitle('Vereinsmitglieder');
  }

  public get assignedPlayerControl() {
    return this.form.controls.assignedPlayerId;
  }

  public get assignedSeniorControl() {
    return this.form.controls.assignedSeniorId;
  }

  onSubmit(withBack = false): void {
    this.hasFormErrors = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.memberService.save(this.form.getRawValue() as Member).then(() => {
      if (withBack) {
        return this.redirectToList();
      }
    });
  }

  cancel() {
    return this.redirectToList();
  }

  redirectToList() {
    return this.router.navigate(['/members/list']);
  }

  deleteMember(item: Member): void {
    item.title = this.firestoreService.getUserTitle(item);
    return this.firestoreService.removeItem('members', item, 'member', '/members/list');
  }

  reset(): void {
    this.form.patchValue(this.savedMember);
  }

  updateControl(path: any, value: any) {
    const control = this.form.controls[path];
    control.setValue(value);
    control.markAsDirty();
  }

}
