import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingFormComponent } from './training-form/training-form.component';
import { TrainingsComponent } from './trainings/trainings.component';


const routes: Routes = [
  {
    path: '',
    component: TrainingsComponent
  },
  {
    path: 'create',
    component: TrainingFormComponent
  },
  {
    path: 'edit/:trainingId',
    component: TrainingFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
