import { Component, Input, OnInit } from '@angular/core';
import { Creation } from '../../../../shared/_interfaces/creation.interface';
import { Publication } from '../../../../shared/_interfaces/publication.interface';

@Component({
  selector: 'creation-publication-info',
  templateUrl: './creation-publication-info.component.html',
  styleUrls: ['./creation-publication-info.component.scss']
})
export class CreationPublicationInfoComponent implements OnInit {

  @Input() creation!: Creation | undefined;
  @Input() publication!: Publication | undefined;

  constructor() { }

  ngOnInit() {
  }

}
