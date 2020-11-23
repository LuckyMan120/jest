import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { AutocompleteModule } from '../../shared/modules/autocomplete/autocomplete.module';
import { SharedModule } from '../../shared/shared.module';
import { CategoryFilterPipe } from '../category/pipes/category-filter.pipe';
import { WysiwygModule } from './../../shared/modules/wysiwyg/wysiwyg.module';
import { SponsorDetailComponent } from './sponsor-detail/sponsor-detail.component';
import { SponsorFormComponent } from './sponsor-form/sponsor-form.component';
import { SponsorFilterComponent } from './sponsor-list/sponsor-filter/sponsor-filter.component';
import { SponsorItemComponent } from './sponsor-list/sponsor-item/sponsor-item.component';
import { SponsorListComponent } from './sponsor-list/sponsor-list.component';
import { sponsorRoutes } from './sponsor-routing.module';
import { SponsorService } from './sponsor.service';
import { SponsorsComponent } from './sponsors/sponsors.component';

@NgModule({
  declarations: [
    CategoryFilterPipe,
    SponsorsComponent,
    SponsorDetailComponent,
    SponsorFilterComponent,
    SponsorFormComponent,
    SponsorItemComponent,
    SponsorListComponent
  ],
  imports: [
    AutocompleteModule,
    MatCheckboxModule,
    MatSelectModule,
    RouterModule.forChild(sponsorRoutes),
    ScrollingModule,
    SharedModule,
    WysiwygModule
  ],
  providers: [
    SponsorService
  ]
})
export class SponsorModule {
}
