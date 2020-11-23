import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HtmlClassService } from '../../../../shared/services/html-class.service';
import { LayoutConfigService } from './../../../../shared/services/layout-config.service';
import { LayoutRefService } from './../../../../shared/services/layout-ref.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  menuHeaderDisplay!: boolean;
  fluid!: boolean;

  @ViewChild('header', { static: true }) header!: ElementRef;

  constructor(
    private layoutRefService: LayoutRefService,
    private layoutConfigService: LayoutConfigService,
    public htmlClassService: HtmlClassService
  ) {
  }

  ngOnInit(): void {
    this.menuHeaderDisplay = this.layoutConfigService.getConfigValue('headerMenuSelfDisplay');
    this.fluid = this.layoutConfigService.getConfigValue('headerSelfWidth') === 'fluid';

    if (this.layoutConfigService.getConfigValue('headerSelfFixedDesktop')) {
      this.header.nativeElement.setAttribute('data-header-minimize', '1');
    }
  }

  ngAfterViewInit(): void {
    this.layoutRefService.addElement('header', this.header.nativeElement);
  }
}
