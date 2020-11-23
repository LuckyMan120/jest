import { Component, OnInit } from '@angular/core';
import { Sponsor } from '@sponsor/_interfaces/sponsor.interface';
import { Observable } from 'rxjs';
import { StartService } from '../start.service';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss'],
})
export class SponsorsComponent implements OnInit {

  sponsors$!: Observable<Sponsor[]>;

  constructor(
    private startService: StartService
  ) { }

  ngOnInit() {

    const args = {
      displayAsTopSponsor: { value: true, operator: '==' },
      'publication.status': { value: 1, operator: '==' }
    } as any;

    this.sponsors$ = this.startService.getItemList('sponsors', args, { field: 'title', value: 'asc' });
  }

}
