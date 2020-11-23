import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Article } from './../../../article/_interfaces/article.interface';
import { TeamService } from './../../team.service';
import { Team } from './../../_interfaces/team.interface';

@Component({

  selector: 'team-assigned-content',
  templateUrl: './team-assigned-content.component.html',
  styleUrls: ['./team-assigned-content.component.scss']
})
export class TeamAssignedContentComponent implements OnInit {

  @Input() edit!: boolean;
  @Input() type!: 'articles' | 'categories' | 'locations' | 'matches' | 'members' | 'players' | 'seniors' | 'teams' | 'users';

  public teamId!: string;
  public form!: FormGroup;
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public data$!: Observable<{
    team: Team,
    items: Article[]
  }>;

  public get assignedItemIds() {
    return this.form.controls.assignedItemIds;
  }

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      type: this.type,
      assignedItemIds: []
    });

    const teamObservable = this.route.params.pipe(
      tap(params => this.teamId = params.teamId),
      switchMap((params) => this.teamService.get(params.teamId))
    );

    const itemsObservable = this.route.params.pipe(
      switchMap(params => this.teamService.getAssignedContent(params.teamId, this.type))
    );

    this.data$ = combineLatest([teamObservable, itemsObservable]).pipe(
      map((x: [Team, any]) => {
        return { team: x[0], items: x[1] };
      }),
      tap(_ => this.isLoading$.next(false)),
      tap((x) => this.assignedItemIds.patchValue(x.items.map(v => v.id)))
    );
  }

  onSubmit(): void {
    this.teamService.assignTeamToItems(this.teamId, this.form.value);
  }

}
