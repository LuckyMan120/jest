import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GalleryFormComponent } from './gallery-form/gallery-form.component';
import { GalleryListComponent } from './gallery-list/gallery-list.component';

export const mediaCenterRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'galleries/list',
    component: GalleryListComponent
  },
  {
    path: 'galleries/edit/:galleryId',
    component: GalleryFormComponent
  },
  {
    path: 'galleries/create',
    component: GalleryFormComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
