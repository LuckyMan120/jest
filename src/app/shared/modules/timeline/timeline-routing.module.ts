import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimelineComponent } from './timeline/timeline.component';
import { TimelineFormComponent } from './timeline-form/timeline-form.component';
import { TimelineTableComponent } from './timeline-table/timeline-table.component';
import { TimelineViewComponent } from './timeline-view/timeline-view.component';

const routes: Routes = [
    {
        path: 'view/:view',
        component: TimelineComponent
        /* children: [
            {
                path: 'table',
                component: TimelineTableComponent
            },
            {
                path: 'line',
                component: TimelineViewComponent
            }
        ] */
    },
    {
        path: 'create',
        component: TimelineFormComponent
    },
    {
        path: 'edit/:eventId',
        component: TimelineFormComponent
    },
    {
        path: '**',
        redirectTo: 'view/table'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class TimelineRoutingModule { }
