import { Routes } from '@angular/router';
import { SponsorDetailComponent } from './sponsor-detail/sponsor-detail.component';
import { SponsorFormComponent } from './sponsor-form/sponsor-form.component';
import { SponsorListComponent } from './sponsor-list/sponsor-list.component';
import { SponsorsComponent } from './sponsors/sponsors.component';

export const sponsorRoutes: Routes = [
  {
    path: '',
    component: SponsorsComponent,
    children: [
      {
        path: 'list',
        component: SponsorListComponent
      },
      {
        path: 'create',
        component: SponsorFormComponent
        // canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'edit/:sponsorId',
        component: SponsorFormComponent
        // canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'detail/:sponsorId',
        component: SponsorDetailComponent
      },
      {
        path: '**',
        redirectTo: 'list'
      }
    ]
  }
];
