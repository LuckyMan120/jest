import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../../shared/services/firestore.service';
import { Member } from '../../member/_interfaces/member.interface';
import { Player } from '../_interfaces/player.interface';
import { Team } from './../../team/_interfaces/team.interface';
import { PlayerService } from './../player.service';

@Component({

  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss']
})
export class PlayerFormComponent implements OnInit {

  public form!: FormGroup;
  public player$!: Observable<Player | undefined>;
  public filteredMembers$!: Observable<Member[]>;
  public teams$!: Observable<Team[]>;

  public hasFormErrors = false;

  public get assignedMemberControl() {
    return this.form.get('assignedMemberId') as AbstractControl;
  }

  public get assignedSeniorControl() {
    return this.form.get('assignedSeniorId') as AbstractControl;
  }
  private savedPlayer!: Player;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.form = this.playerService.getPlayerFormFields();

    this.player$ = this.route.params.pipe(
      switchMap(params => this.playerService.get(params.playerId)),
      tap((player: Player | undefined) => {
        if (player) {
          this.form.patchValue(player);

          if (player.isImported) {
            this.form.disable();
            this.form.get('assignedMemberId')?.enable();
            this.form.get('assignedSeniorId')?.enable();
            this.form.get('galleries')?.enable();
            this.form.get('publication')?.enable();
          }
          this.savedPlayer = Object.freeze(Object.assign({}, player));
        }
      })
    );
  }

  onSubmit(withBack = false): void {
    this.hasFormErrors = false;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.hasFormErrors = true;
      return;
    }

    this.playerService.save(this.form.getRawValue() as Player).then(() => {
      if (withBack) {
        return this.redirectToList();
      }
    });
  }

  cancel(): Promise<boolean> {
    return this.redirectToList();
  }

  redirectToList(): Promise<boolean> {
    return this.router.navigate(['/players/list']);
  }

  deletePlayer(item: Player): void {
    item.title = this.firestoreService.getUserTitle(item);
    this.firestoreService.removeItem('players', item, '/players/list');
  }

  reset(): void {
    this.form.patchValue(this.savedPlayer);
  }

  updateControl($event: any) {
    const control = this.form.controls.galleries;
    control.setValue($event);
    control.markAsDirty();
  }
}
