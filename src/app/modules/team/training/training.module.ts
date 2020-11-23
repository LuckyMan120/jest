import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../../shared/shared.module';
import { TrainingFormComponent } from './training-form/training-form.component';
import { GroupTrainingsPipe } from './training-list/group-trainings.pipe';
import { TrainingListComponent } from './training-list/training-list.component';
import { TrainingRoutingModule } from './training-routing.module';
import { TrainingsComponent } from './trainings/trainings.component';

@NgModule({
  declarations: [
    TrainingFormComponent,
    TrainingsComponent,
    TrainingListComponent,
    GroupTrainingsPipe
  ],
  imports: [
    MatSelectModule,
    SharedModule,
    TrainingRoutingModule
  ],
  providers: [
  ]
})
export class TrainingModule {
}
