import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CategoryService } from '../../../category/category.service';
import { Category } from '../../../category/_interfaces/category.interface';
import { TeamService } from '../../team.service';
import { Team } from '../../_interfaces/team.interface';

@Component({

  selector: 'team-positions-form',
  templateUrl: './team-positions-form.component.html',
  styleUrls: ['./team-positions-form.component.scss']
})
export class TeamPositionsFormComponent implements OnInit {

  @Input() managementType!: 'externMgmt' | 'internMgmt';
  @Input() title!: string;
  @Input() form!: FormGroup;

  public team$!: Observable<Team>;

  public categories$!: Observable<Category[]>;
  public hasFormErrors = false;

  constructor(
    private teamService: TeamService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.categories$ = this.categoryService.getCategoryListByParentCategory(this.managementType);
  }

  public get managementTypeControls() {
    return (this.form.get(this.managementType) as any).controls;
  }

  createTeamManagement = (): void => {
    const control = this.form.controls[this.managementType] as FormArray;
    this.teamService.initTeamManagement(this.managementType, control);
  }

  removeTeamManagement = ($event: number): void => {
    const control = this.form.controls[this.managementType] as FormArray;
    control.removeAt($event);
  }

  trackByFn = (item: any): string => {
    return item.id;
  }

}
