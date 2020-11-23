import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../modules/start/start.module').then((m) => m.StartModule),
    data: {
      preload: true,
      title: 'Neuigkeiten',
      description: 'Die aktuellsten Infos der Sportfreunde',
    },
  },
  {
    path: 'mannschaften',
    loadChildren: () => import('../modules/team/team.module').then((m) => m.TeamModule),
    data: {
      preload: true,
      title: 'Mannschaften',
      description: 'Am Spielbetrieb teilnehmende Mannschaften der aktuellen Saison',
    },
  },
  {
    path: 'verein',
    loadChildren: () => import('../modules/club/club.module').then((m) => m.ClubModule),
    data: {
      preload: true,
      title: 'Verein',
      description: 'Alle Informationen zu unserem Verein',
    },
  },
  {
    path: 'kontakt',
    loadChildren: () => import('../modules/contact/contact.module').then((m) => m.ContactModule),
    data: {
      preload: true,
      title: 'Kontakt und Ansprechpartner',
      description: 'Kontaktmöglichkeiten und wichtige Ansprechpartner unseres Vereins',
    },
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class ThemeRoutingModule { }
