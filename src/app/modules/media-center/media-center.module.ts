import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GalleryFormComponent } from './gallery-form/gallery-form.component';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { mediaCenterRoutes } from './media-center-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    GalleryListComponent,
    GalleryFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    RouterModule.forChild(mediaCenterRoutes),
    SharedModule
  ],
  providers: [
  ]
})
export class MediaCenterModule {
}
