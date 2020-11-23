export class MenuConfig {
  public defaults: any = {
    header: {
      self: {},
      items: [
        {
          title: 'Verein',
          root: true,
          icon: 'fa fa-school',
          toggle: 'click',
          alignment: 'left',
          submenu: {
            type: 'mega',
            width: '1000px',
            alignment: 'left',
            columns: [
              {
                bullet: 'line',
                heading: {
                  heading: true,
                  title: 'Mannschaften',
                  bullet: 'dot',
                },
                items: [
                  {
                    title: 'Mannschaftsliste',
                    page: '/teams/list'
                  },
                  {
                    title: 'Mannschaft erstellen',
                    page: '/teams/create'
                  },
                  {
                    title: 'Trainingseinheiten',
                    page: '/teams/trainings',
                  }
                ]
              },
              {
                bullet: 'line',
                heading: {
                  heading: true,
                  title: 'Mitglieder',
                  bullet: 'dot',
                },
                items: [
                  {
                    title: 'Übersicht',
                    page: '/members/dashboard',
                  },
                  {
                    title: 'Mitgliederliste',
                    page: '/members/list',
                  },
                  {
                    title: 'Mitglied erstellen',
                    page: '/members/create'
                  }
                ]
              },
              {
                bullet: 'line',
                heading: {
                  heading: true,
                  title: 'Seniors',
                  bullet: 'dot'
                },
                items: [
                  {
                    title: 'Übersicht',
                    page: '/seniors/dashboard'
                  },
                  {
                    title: 'AH-Mitgliederliste',
                    page: '/seniors/list'
                  },
                  {
                    title: 'AH-Mitglied erstellen',
                    page: '/seniors/create'
                  }
                ]
              },
              {
                bullet: 'line',
                heading: {
                  heading: true,
                  title: 'Spieler',
                  bullet: 'dot'
                },
                items: [
                  {
                    title: 'Übersicht',
                    page: '/players/dashboard'
                  },
                  {
                    title: 'Spielerliste',
                    page: '/players/list'
                  },
                  {
                    title: 'Spieler erstellen',
                    page: '/players/create'
                  }
                ]
              }
            ]
          }
        },
        {
          title: 'Administration',
          root: true,
          icon: 'fa fa-tools',
          toggle: 'click',
          alignment: 'left',
          submenu: {
            type: 'classic',
            alignment: 'left',
            items: [
              {
                title: 'Einstellungen',
                icon: 'fa fa-wrench',
                page: '/settings/application'
              },
              {
                title: 'Konfiguration',
                icon: 'fa fa-tools',
                page: '/settings/configuration'
              }/*,
              {
                title: 'analytics',
                icon: 'fa fa-chart-area',
                page: '/analytics'
              },
              {
                title: 'Tasks',
                icon: 'fa fa-clock',
                page: '/tasks'
              },
              {
                title: 'Logs',
                icon: 'fas fa-clipboard-list',
                page: '/logs'
              }*/,
              {
                title: 'Benutzer',
                page: '/users',
                icon: 'fa fa-users-cog',
                submenu: {
                  type: 'classic',
                  alignment: 'right',
                  bullet: 'dot',
                  items: [
                    {
                      title: 'Benutzerliste',
                      page: '/users/list'
                    },
                    {
                      title: 'Rollen',
                      page: '/users/roles'
                    },
                    {
                      title: 'Berechtigungen',
                      page: '/users/permissions'
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          title: 'Inhalte',
          root: true,
          icon: 'fas fa-newspaper',
          toggle: 'click',
          alignment: 'left',
          submenu: {
            type: 'mega',
            width: '1000px',
            alignment: 'left',
            columns: [
              {
                bullet: 'line',
                heading: {
                  heading: true,
                  title: 'Artikel',
                  bullet: 'dot'
                },
                items: [
                  /*
                  {
                    title: 'Dashboard',
                    page: '/articles/dashboard',
                  },*/
                  {
                    title: 'Artikelliste',
                    page: '/articles/list'
                  },
                  {
                    title: 'Artikel erstellen',
                    page: '/articles/create'
                  }
                ]
              },
              {
                bullet: 'line',
                heading: {
                  heading: true,
                  title: 'Dateiverwaltung',
                  bullet: 'dot'
                },
                items: [
                  {
                    title: 'Übersicht',
                    page: '/media-center/dashboard'
                  },
                  {
                    title: 'Galerien',
                    page: '/media-center/galleries/list'
                  },
                  {
                    title: 'Galerie erstellenny',
                    page: '/media-center/galleries/create'
                  }
                ]
              },
              {
                bullet: 'line',
                heading: {
                  heading: true,
                  title: 'Spiele',
                  bullet: 'dot'
                },
                items: [
                  /*
                  {
                    title: 'Dashboard',
                    page: '/matches/dashboard'
                  },
                  {
                    title: 'Match-Calendar',
                    page: '/matches/match-calendar',
                  },*/
                  {
                    title: 'Alle Spiele',
                    page: '/matches/list'
                  },
                  {
                    title: 'Spiel erstellen',
                    page: '/matches/create'
                  }
                ]
              }
            ]
          }
        },
      ]
    },
    aside: {
      self: {},
      items: [
        {
          title: 'Startseite',
          root: true,
          icon: 'fa fa-home',
          page: '/start/dashboard',
          bullet: 'dot'
        },
        {
          title: 'Kalender',
          root: true,
          page: '/calendar',
          icon: 'fa fa-calendar-alt'
        },
        {
          section: 'Inhalte',
          permissions: ['dateiverwaltung', 'artikel', 'spiele', 'newsletter']
        },
        {
          title: 'Dateiverwaltung',
          root: true,
          icon: 'fa fa-file-upload',
          permissions: ['dateiverwaltung'],
          bullet: 'dot',
          submenu: [
            {
              title: 'Übersicht',
              page: '/media-center/dashboard'
            },
            { section: 'Fotogalerien' },
            {
              title: 'Alle Fotogalerien',
              page: '/media-center/galleries/list'
            },
            {
              title: 'Galerie erstellen',
              page: '/media-center/galleries/create'
            }
          ]
        }/*,
        {
          title: 'Newsletter',
          root: true,
          icon: 'fa fa-newspaper',
          bullet: 'dot',
          permissions: ['newsletter'],
          submenu: [
            {
              title: 'Newsletter-Dashboard',
              page: '/newsletter/dashboard',
            },
            {
              title: 'Create Newsletter',
              page: '/newsletter/create'
            }
          ]
        }*/,
        {
          title: 'Artikel',
          root: true,
          icon: 'fa fa-file-signature',
          bullet: 'dot',
          permissions: ['artikel'],
          submenu: [
            {
              title: 'Artikel-Liste',
              page: '/articles/list',
            },
            {
              title: 'Artikel erstellen',
              page: '/articles/create'
            }
          ]
        },
        {
          title: 'Spiele',
          root: true,
          icon: 'fa fa-baseball-ball',
          bullet: 'dot',
          permissions: ['spiele'],
          submenu: [
            {
              title: 'Übersicht',
              page: '/matches/dashboard'
            }/*,
						{
							title: 'Match-Calendar',
							page: '/matches/match-calendar'
						}*/,
            {
              title: 'Alle Spiele',
              page: '/matches/list'
            },
            {
              title: 'Spiel erstellen',
              page: '/matches/create'
            }
          ]
        },
        {
          section: 'Vereinsverwaltung',
          permissions: ['verein'],
        },
        {
          title: 'Verein',
          root: true,
          icon: 'fa fa-school',
          permissions: ['verein'],
          submenu: [
            {
              title: 'Informationen',
              page: '/club/info'
            },
            {
              title: 'Ehrenmitglieder',
              page: '/club/honoraries'
            },
            {
              title: 'Vorstand',
              page: '/club/management'
            },
            {
              title: 'Zeitleiste',
              page: '/club/timeline'
            }
          ]
        },
        {
          title: 'Mitglieder',
          root: true,
          icon: 'fa fa-user-friends',
          permissions: ['mitglieder'],
          submenu: [
            {
              title: 'Übersicht',
              page: '/members/dashboard'
            },
            {
              title: 'Mitgliederliste',
              page: '/members/list'
            },
            {
              title: 'Mitglied erstellen',
              page: '/members/create'
            }
          ]
        },
        {
          title: 'Alte Herren',
          root: true,
          icon: 'fa fa-user-friends',
          permissions: ['altherren'],
          submenu: [
            {
              title: 'Übersicht',
              page: '/seniors/dashboard'
            },
            {
              title: 'Altherren-Liste',
              page: '/seniors/list'
            },
            {
              title: 'Mitglied erstellen',
              page: '/seniors/create'
            }
          ]
        },
        {
          title: 'Spieler',
          root: true,
          icon: 'fa fa-user-friends',
          permissions: ['spieler'],
          submenu: [
            {
              title: 'Übersicht',
              page: '/players/dashboard'
            },
            {
              title: 'Spielerliste',
              page: '/players/list'
            },
            {
              title: 'Spieler erstellen',
              page: '/players/create'
            },
          ]
        },
        {
          title: 'Mannschaften',
          root: true,
          icon: 'fa fa-users',
          permissions: ['mannschaften'],
          submenu: [
            {
              title: 'Mannschaftsliste',
              page: '/teams/list'
            },
            {
              title: 'Mannschaft erstellen',
              page: '/teams/create'
            },
            {
              title: 'Trainingseinheiten',
              page: '/teams/trainings'
            }
          ]
        },
        {
          title: 'Spielorte',
          root: true,
          icon: 'fa fa-map-signs',
          permissions: ['treffpunkte'],
          submenu: [
            {
              title: 'Alle Spielorte',
              page: '/locations/list'
            },
            {
              title: 'Spielort erstellen',
              page: '/locations/create'
            }
          ]
        },
        {
          title: 'Sponsoren',
          root: true,
          page: '/sponsors',
          icon: 'fa fa-euro-sign',
          permissions: ['sponsoren']
        },
        {
          title: 'Kategorien',
          root: true,
          page: '/categories',
          icon: 'fa fa-folder',
          permissions: ['kategorien']
        },
        {
          section: 'Seitenverwaltung',
          permissions: [
            'einstellungen',
            'benutzer',
            'benutzer-rollen',
            'benutzer-berechtigungen',
            'logdateien'
          ]
        },

        {
          title: 'Einstellungen',
          root: true,
          icon: 'fa fa-wrench',
          permissions: ['einstellungen', 'konfiguration', 'layout'],
          submenu: [
            {
              title: 'Einstellungen',
              page: '/settings/application',
              permissions: ['einstellungen']
            },
            {
              title: 'Konfiguration',
              page: '/settings/configuration',
              permissions: ['konfiguration']
            }/*,
						{
							title: 'Layout',
							page: '/layout',
							permissions: ['layout-mgmt']
						}*/
          ]
        }/*,
				{
					title: 'Analytics',
					root: true,
					page: '/analytics',
					icon: 'fa  fa-chart-area ',
					permissions: ['analytics-mgmt']
				},
				{
					title: 'Tasks',
					root: true,
					page: '/tasks',
					icon: 'fa fa-clock',
					permissions: ['task-mgmt']
				},
        {
          title: 'Logs',
          icon: 'fas fa-clipboard-list',
          page: '/logs',
          permissions: ['logdateien']
        }*/,
        {
          title: 'Benutzer',
          root: true,
          icon: 'fa fa-users-cog',
          bullet: 'dot',
          permissions: ['benutzer', 'benutzer-rollen', 'benutzer-berechtigungen'],
          submenu: [
            {
              title: 'Benutzerliste',
              page: '/users/list',
              permissions: ['benutzer']
            },
            {
              title: 'Rollen',
              page: '/roles',
              permissions: ['benutzer-rollen']
            },
            {
              title: 'Berechtigungen',
              page: '/permissions',
              permissions: ['benutzer-berechtigungen']
            }
          ]
        }
      ]
    }
  };

  public get configs(): any {
    return this.defaults;
  }

}
