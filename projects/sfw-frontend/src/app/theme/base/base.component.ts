import { Component, OnInit } from '@angular/core';
import { Application } from '@application/_interfaces/application.interface';
import { Observable } from 'rxjs';
import { ThemeService } from './../theme.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  application$!: Observable<Application | undefined>;

  constructor(
    private themeService: ThemeService
  ) {
  }

  ngOnInit() {
    this.application$ = this.themeService.getCurrentApplication();
  }

}
