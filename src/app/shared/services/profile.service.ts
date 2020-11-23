import { Injectable } from '@angular/core';
import { Query } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { BirthdayList } from './../../modules/member/_interfaces/birthday-list';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private zodiacs: string[] = [
    'Capricorn',
    'Aquarius',
    'Pisces',
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn'
  ];

  constructor(
    private firestoreService: FirestoreService
  ) { }

  getBirthdayList(dayArray: any[], collection?: string): Observable<BirthdayList[]> {

    let observables;
    const types = collection ? [collection] : ['members', 'players', 'seniors'];

    observables = types.map(t => this.firestoreService.col<any>(t, (ref: Query) =>
      ref.where('birthMonthDay', 'in', dayArray.map(day => day.value))).valueChanges()
    );

    return combineLatest(observables.map(o => o.pipe(take(1)))).pipe(
      take(1),
      map((docArrays: any[]) => {
        const result: BirthdayList[] = [];
        types.map((type, idx) => {
          docArrays[idx].map((item: BirthdayList) => {

            const i = result.findIndex((e: BirthdayList) =>
              e.firstName === item.firstName && e.lastName === item.lastName && e.birthDate === item.birthDate
            );
            i > -1
              ? result[i].types.push(types[i])
              : result.push({ ...item, types: [type], age: this.calculateAge(item.birthDate), zodiac: this.getZodiac(item.birthDate) });
          });
        });
        return result;
      })
    );
  }

  public getZodiac(birthday: number): string {
    const dateOfBirth = new Date(birthday);
    const month = dateOfBirth.getMonth();
    const day = dateOfBirth.getDate();
    const lastDay = [19, 18, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20, 19];
    return (day > lastDay[month]) ? this.zodiacs[month + 1] : this.zodiacs[month];
  }

  public calculateAge(birthday: number): number {
    const currentBirthday = new Date(birthday).setFullYear(new Date().getFullYear());
    return new Date(currentBirthday).getFullYear() - new Date(birthday).getFullYear();
  }

}

