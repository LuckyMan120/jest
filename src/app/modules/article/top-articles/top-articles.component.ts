import { Component, Input, OnInit } from '@angular/core';

export interface Widget5Data {
  pic?: string;
  title: string;
  desc: string;
  url?: string;
  info?: string;
  largeInfo?: string;
}

@Component({
  selector: 'top-articles',
  templateUrl: './top-articles.component.html',
  styleUrls: ['./top-articles.component.scss']
})
export class TopArticlesComponent implements OnInit {

  @Input() data!: Widget5Data[];

  ngOnInit() {
  }

}
