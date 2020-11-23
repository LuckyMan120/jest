import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LayoutConfigService } from './../../../shared/services/layout-config.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  fields!: any[];
  savedFields!: any[];

  form = new FormGroup({});
  options: any = {};
  model: any = {};

  constructor(
    private layoutConfigService: LayoutConfigService
  ) {
    console.log(this.layoutConfigService.getConfig());
  }

  ngOnInit() {
    this.form = new FormGroup({});
  }

  reset() {
    this.form.patchValue(this.savedFields);
  }

  onSubmit() {
    this.layoutConfigService.saveConfig(this.form.value);
  }

}
