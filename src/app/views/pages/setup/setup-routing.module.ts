import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Step1Guard } from './guards/step1.guard';
import { Step2Guard } from './guards/step2.guard';
import { FirstStepComponent } from './start/first-step/first-step.component';
import { SecondStepComponent } from './start/second-step/second-step.component';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  {
    path: '',
    component: StartComponent,
    children: [
      {
        path: 'step-1',
        component: FirstStepComponent,
        canActivate: [Step1Guard]
      },
      {
        path: 'step-2',
        component: SecondStepComponent,
        canActivate: [Step2Guard],
      },
      {
        path: '**',
        redirectTo: 'step-1'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    Step1Guard,
    Step2Guard
  ]
})
export class SetupRoutingModule { }
