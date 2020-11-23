import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './../../../shared/guards/auth.guard';
import { BaseComponent } from './base/base.component';
import { ErrorPageComponent } from './error-page/error-page.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    data: { permissions: ['adminzugang'] },
    children: [
      {
        path: 'articles',
        loadChildren: () => import('../../../modules/article/article.module').then(m => m.ArticleModule),
        canActivate: [AuthGuard],
        data: { permissions: ['artikel'] },
      },
      {
        path: 'calendar',
        loadChildren: () => import('../../../modules/calendar/calendar.module').then(m => m.CalendarModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('../../../modules/category/category.module').then(m => m.CategoryModule),
        canActivate: [AuthGuard],
        data: { permissions: ['kategorien'] },
      },
      {
        path: 'club',
        loadChildren: () => import('../../../modules/club/club.module').then(m => m.ClubModule),
        canActivate: [AuthGuard],
        data: { permissions: ['verein'] }
      },
      {
        path: 'locations',
        loadChildren: () => import('../../../modules/location/location.module').then(m => m.LocationModule),
        canActivate: [AuthGuard],
        data: { permissions: ['treffpunkte'] }
      },
      {
        path: 'matches',
        loadChildren: () => import('../../../modules/match/match.module').then(m => m.MatchModule),
        canActivate: [AuthGuard],
        data: { permissions: ['spiele'] },
      },
      {
        path: 'media-center',
        loadChildren: () => import('../../../modules/media-center/media-center.module').then(m => m.MediaCenterModule),
        canActivate: [AuthGuard],
        data: { permissions: ['dateiverwaltung'] },
      },
      {
        path: 'members',
        loadChildren: () => import('../../../modules/member/member.module').then(m => m.MemberModule),
        canActivate: [AuthGuard],
        data: { permissions: ['mitglieder'] },
      },
      {
        path: 'players',
        loadChildren: () => import('../../../modules/player/player.module').then(m => m.PlayerModule),
        canActivate: [AuthGuard],
        data: { permissions: ['spieler'] },
      },
      {
        path: 'seniors',
        loadChildren: () => import('../../../modules/senior/senior.module').then(m => m.SeniorModule),
        canActivate: [AuthGuard],
        data: { permissions: ['altherren'] },
      },
      {
        path: 'settings',
        loadChildren: () => import('../../../modules/settings/settings.module').then(m => m.SettingsModule),
        canActivate: [AuthGuard],
        data: { permissions: ['einstellungen'] },
      },
      {
        path: 'sponsors',
        loadChildren: () => import('../../../modules/sponsor/sponsor.module').then(m => m.SponsorModule),
        canActivate: [AuthGuard],
        data: { permissions: ['sponsoren'] },
      },
      {
        path: 'start',
        loadChildren: () => import('../../../modules/start/start.module').then(m => m.StartModule)
      },
      {
        path: 'teams',
        loadChildren: () => import('../../../modules/team/team.module').then(m => m.TeamModule),
        canActivate: [AuthGuard],
        data: { permissions: ['mannschaften'] },
      },
      {
        path: 'timeline',
        loadChildren: () => import('../../../shared/modules/timeline/timeline.module').then(m => m.TimelineModule),
        canActivate: [AuthGuard],
        data: { permissions: ['timeline-mgmt'] },
      },
      {
        path: 'users',
        loadChildren: () => import('../../../modules/user/user.module').then(m => m.UserModule),
        canActivate: [AuthGuard],
        data: { permissions: ['benutzer'] },
      },
      {
        path: 'permissions',
        loadChildren: () => import('../../../modules/permission/permission.module').then(m => m.PermissionModule),
        canActivate: [AuthGuard],
        data: { permissions: ['benutzer-berechtigungen'] },
      },
      {
        path: 'roles',
        loadChildren: () => import('../../../modules/role/role.module').then(m => m.RoleModule),
        canActivate: [AuthGuard],
        data: { permissions: ['benutzer-rollen'] },
      },
      {
        path: 'forbidden',
        component: ErrorPageComponent,
        data: {
          type: 'error-v2',
          code: 403,
          title: 'forbidden.title',
          desc: 'forbidden.desc'
        }
      },
      {
        path: '**',
        redirectTo: 'start',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
