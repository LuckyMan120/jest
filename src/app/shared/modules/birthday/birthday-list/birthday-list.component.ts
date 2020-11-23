import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BirthdayList } from './../../../../modules/member/_interfaces/birthday-list';
import { ProfileService } from './../../../services/profile.service';

@Component({
  selector: 'birthday-list',
  templateUrl: './birthday-list.component.html',
  styleUrls: ['./birthday-list.component.scss']
})
export class BirthdayListComponent implements OnInit {

  @Input() type: string | undefined;
  birthdayList$!: Observable<BirthdayList[]>;
  now: Date;
  days!: any[];

  constructor(
    private profileService: ProfileService
  ) {
    this.now = new Date();
  }

  ngOnInit() {
    const dateYesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date());
    const dateToday = this.now;
    const dateTomorrow = (d => new Date(d.setDate(d.getDate() + 1)))(new Date());

    const yesterday = {
      title: 'Gestern',
      value: `${('0' + (dateYesterday.getMonth() + 1)).slice(-2)}-${('0' + dateYesterday.getDate()).slice(-2)}`
    };
    const today = {
      title: 'Heute',
      value: `${('0' + (dateToday.getMonth() + 1)).slice(-2)}-${('0' + (dateToday.getDate())).slice(-2)}`
    };
    const tomorrow = {
      title: 'Morgen',
      value: `${('0' + (dateTomorrow.getMonth() + 1)).slice(-2)}-${('0' + dateTomorrow.getDate()).slice(-2)}`
    };

    this.days = [today, tomorrow, yesterday];
    this.birthdayList$ = this.profileService.getBirthdayList(this.days, this.type);
  }


}
