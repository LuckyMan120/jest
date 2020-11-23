import { Component, OnInit } from '@angular/core';
import { LayoutConfigService } from './../../../../shared/services/layout-config.service';

@Component({
  selector: 'app-subheader',
  templateUrl: './subheader.component.html',
})
export class SubheaderComponent implements OnInit {

  layout!: string;
  fluid!: boolean;
  clear!: boolean;

  constructor(
    private layoutConfigService: LayoutConfigService
  ) {
  }

  ngOnInit(): void {
    this.layout = this.layoutConfigService.getConfigValue('subheaderLayout');
    this.fluid = this.layoutConfigService.getConfigValue('subheaderWidth') === 'fluid';
    this.clear = this.layoutConfigService.getConfigValue('subheaderClear');
  }
}
