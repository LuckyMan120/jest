import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AsArrayPipe } from '../../pipes/as-array.pipe';
import { CalendarService } from './../../../modules/calendar/calendar.service';
import { LocationService } from './../../../modules/location/location.service';
import { MatchService } from './../../../modules/match/match.service';
import { TeamService } from './../../../modules/team/team.service';
import { UserService } from './../../../modules/user/user.service';
import { AutocompletePreviewPipe } from './autocomplete-preview.pipe';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';

@NgModule({
  declarations: [
    AutocompleteComponent,
    AutocompletePreviewPipe,
    AsArrayPipe
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,

  ],
  exports: [
    AutocompleteComponent
  ],
  providers: [
    CalendarService,
    LocationService,
    MatchService,
    TeamService,
    UserService
  ]
})
export class AutocompleteModule { }
