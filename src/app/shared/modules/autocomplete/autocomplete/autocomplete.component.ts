import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { FirestoreService } from '../../../../shared/services/firestore.service';
import { NotificationService } from './../../../services/notification.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  @Input() selectable = true;
  @Input() removable = true;
  @Input() control!: AbstractControl;
  @Input() multiple = false;
  @Input() itemsType!: 'articles' | 'categories' | 'locations' | 'matches' | 'members' | 'players' | 'seniors' | 'teams' | 'users';
  @Input() placeholder = 'Search';

  inputControl = new FormControl();
  options$!: Observable<any>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private firestoreService: FirestoreService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.options$ = this.inputControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((value: any) => this.firestoreService.getAutocompleteItems(this.itemsType, value)),
        tap(res => {
          if (!res || res.length === 0) {
            this.notificationService.showNotification('Es wurden keine Ergebnisse für Deine Eingabe gefunden.', 'danger');
          }
        })
      );

    this.inputControl.disable();
  }

  public checkAutoCompleteValue(input: HTMLInputElement) {
    input.value = '';
  }

  public optionSelected(evt: MatAutocompleteSelectedEvent): void {
    if (this.multiple) {
      let currentValue = this.control.value || [];
      if (!Array.isArray(currentValue)) {
        currentValue = [currentValue];
      }
      currentValue.push(evt.option.value);
      this.control.patchValue(currentValue);
    } else {
      this.control.patchValue(evt.option.value);
    }
    this.inputControl.patchValue(null);

  }

  public remove(option: any): void {
    if (this.multiple) {
      let currentValue = this.control.value || [];
      if (!Array.isArray(currentValue)) {
        currentValue = [currentValue];
      }
      const i = currentValue.indexOf(option, 0);
      if (i > -1) {
        currentValue.splice(i, 1);
      }
      this.control.patchValue(currentValue);

    } else {
      this.control.patchValue(null);
    }
    this.inputControl.patchValue(null);
  }

}
