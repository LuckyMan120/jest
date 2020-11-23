import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { NgPipesModule } from 'ngx-pipes';
import { ActionNotificationComponent } from './action-notification/action-notification.component';
import { AlertComponent } from './alert/alert.component';
import { DeleteEntityDialogComponent } from './delete-entity-dialog/delete-entity-dialog.component';

@NgModule({
  declarations: [
    ActionNotificationComponent,
    AlertComponent,
    DeleteEntityDialogComponent
  ],
  exports: [
    AlertComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    NgPipesModule,
    ReactiveFormsModule
  ]
})
export class CrudModule { }
