import { MenuItem } from './../_interfaces/menu-item.interface';
export class LayoutConfig {

  private backendDefaults: MenuItem[] = [
    {
      id: 'asideSelfSkin',
      type: 'radio',
      options: [
        { value: 'dark', label: 'layout.backend.dark' },
        { value: 'light', label: 'layout.backend.light' }
      ],
      value: 'dark'
    },
    {
      id: 'asideSelfDisplay',
      type: 'checkbox',
      value: true
    },
    {
      id: 'asideSelfFixed',
      type: 'checkbox',
      value: true
    },
    {
      id: 'asideSelfMinimizeToggle',
      type: 'checkbox',
      value: true
    },
    {
      id: 'asideSelfMinimizeDefault',
      type: 'checkbox',
      value: false
    },
    {
      id: 'asideFooterSelfDisplay',
      type: 'checkbox',
      value: true
    },
    {
      id: 'asideMenuDropdown',
      type: 'checkbox',
      value: false
    },
    {
      id: 'asideMenuScroll',
      type: 'checkbox',
      value: false
    },
    {
      id: 'asideMenuSubmenuAccordion',
      type: 'checkbox',
      value: true
    },
    {
      id: 'asideMenuSubmenuDropdownArrow',
      type: 'checkbox',
      value: true
    },
    {
      id: 'asideMenuSubmenuDropdownHoverTimeout',
      type: 'number',
      value: '500'
    },
    {
      id: 'brandSelfSkin',
      value: 'dark',
      type: 'radio',
      options: [
        { value: 'dark', label: 'layout.backend.dark' },
        { value: 'light', label: 'layout.backend.light' }
      ]
    },
    {
      id: 'baseColors',
      value: ['#c5cbe3', '#a1a8c3', '#3d4465', '#3e4466'],
      type: 'select',
      multiple: true,
      options: [
        { value: '#f0f3ff', label: '#f0f3ff' },
        { value: '#d9dffa', label: '#d9dffa' },
        { value: '#c5cbe3', label: '#c5cbe3' },
        { value: '#a1a8c3', label: '#a1a8c3' },
        { value: '#3d4465', label: '#3d4465' },
        { value: '#afb4d4', label: '#afb4d4' },
        { value: '#646c9a', label: '#646c9a' }
      ]
    },
    {
      id: 'baseShape',
      value: ['#c5cbe3', '#a1a8c3', '#3d4465', '#3e4466'],
      type: 'select',
      multiple: true,
      options: [
        { value: '#f0f3ff', label: '#f0f3ff' },
        { value: '#d9dffa', label: '#d9dffa' },
        { value: '#c5cbe3', label: '#c5cbe3' },
        { value: '#a1a8c3', label: '#a1a8c3' },
        { value: '#3d4465', label: '#3d4465' },
        { value: '#afb4d4', label: '#afb4d4' },
        { value: '#646c9a', label: '#646c9a' }
      ]
    },
    {
      id: 'brandColor',
      value: '#5d78ff'
    },
    {
      id: 'darkColor',
      value: '#282a3c'
    },
    {
      id: 'lightColor',
      value: '#ffffff'
    },
    {
      id: 'primaryColor',
      value: '#5867dd'
    },
    {
      id: 'successColor',
      value: '#34bfa3'
    },
    {
      id: 'warningColor',
      value: '#ffb822'
    },
    {
      id: 'dangerColor',
      value: '#fd3995'
    },
    {
      id: 'contentFitTop',
      type: 'checkbox',
      value: false
    },
    {
      id: 'contentWidth',
      type: 'radio',
      value: 'fluid',
      options: [
        { value: 'fluid', label: 'layout.backend.content.width.fluid' },
        { value: 'fixed', label: 'layout.backend.content.width.fixed' }
      ]
    },
    {
      id: 'footerSelfWidth',
      type: 'radio',
      value: 'fluid',
      options: [
        { value: 'fluid', label: 'layout.backend.footerSelfWidthFluid' },
        { value: 'fixed', label: 'layout.backend.footerSelfWidthFixed' },
      ]
    },
    {
      id: 'footerSelfDisplay',
      type: 'checkbox',
      value: true
    },
    {
      id: 'headerSelfSkin',
      type: 'radio',
      value: 'light',
      options: [
        { value: 'dark', label: 'layout.backend.dark' },
        { value: 'light', label: 'layout.backend.light' }
      ]
    },
    {
      id: 'headerSelfWidth',
      type: 'radio',
      value: 'fluid',
      options: [
        { value: 'boxed', label: 'layout.backend.width.boxed' },
        { value: 'fluid', label: 'layout.backend.width.fluid' }
      ]
    },
    {
      id: 'headerSelfFixedDesktop',
      type: 'checkbox',
      value: true
    },
    {
      id: 'headerSelfFixedMobile',
      type: 'checkbox',
      value: true
    },
    {
      id: 'headerTopbarSearchDisplay',
      type: 'checkbox',
      value: true
    },
    {
      id: 'headerTopbarSearchLayout',
      type: 'radio',
      value: 'dropdown',
      options: [
        { value: 'offCanvas', label: 'layout.backend.offCanvas' },
        { value: 'dropdown', label: 'layout.backend.dropdown' }
      ]
    },
    {
      id: 'headerTopbarNotificationsDisplay',
      type: 'checkbox',
      value: true
    },
    {
      id: 'headerTopbarNotificationsLayout',
      type: 'radio',
      value: 'dropdown',
      options: [
        { value: 'offCanvas', label: 'layout.backend.offCanvas' },
        { value: 'dropdown', label: 'layout.backend.dropdown' }
      ]
    },
    {
      id: 'headerTopbarNotificationsStyle',
      type: 'radio',
      value: 'dark',
      options: [
        { value: 'light', label: 'layout.backend.light' },
        { value: 'dark', label: 'layout.backend.dark' }
      ]
    },
    {
      id: 'headerTopbarQuickActionsDisplay',
      type: 'checkbox',
      value: true
    },
    {
      id: 'headerTopbarQuickActionsLayout',
      type: 'radio',
      value: 'dropdown',
      options: [
        { value: 'offCanvas', label: 'layout.backend.offCanvas' },
        { value: 'dropdown', label: 'layout.backend.dropdown' }
      ]
    },
    {
      id: 'headerTopbarQuickActionsStyle',
      type: 'radio',
      value: 'dark',
      options: [
        { value: 'light', label: 'layout.backend.light' },
        { value: 'dark', label: 'layout.backend.dark' }
      ]
    },
    {
      id: 'headerTopbarUserDisplay',
      type: 'checkbox',
      value: true
    },
    {
      id: 'headerTopbarUserLayout',
      type: 'radio',
      value: 'dropdown',
      options: [
        { value: 'offCanvas', label: 'layout.backend.offCanvas' },
        { value: 'dropdown', label: 'layout.backend.dropdown' }
      ]
    },
    {
      id: 'headerTopbarUserDropdownStyle',
      type: 'radio',
      value: 'dark',
      options: [
        { value: 'light', label: 'layout.backend.light' },
        { value: 'dark', label: 'layout.backend.dark' }
      ]
    },
    {
      id: 'headerTopbarLanguagesDisplay',
      type: 'checkbox',
      value: true
    },
    {
      id: 'headerTopbarNotificationsDropdownStyle',
      type: 'radio',
      value: 'dark',
      options: [
        { value: 'light', label: 'layout.backend.light' },
        { value: 'dark', label: 'layout.backend.dark' }
      ]
    },
    {
      id: 'headerTopbarQuickPanelDisplay',
      type: 'checkbox',
      value: true
    },
    {
      id: 'headerMenuSelfDisplay',
      type: 'checkbox',
      value: true
    },
    {
      id: 'headerMenuSelfLayout',
      value: 'default'
    },
    /*{
      key: 'header.menu.self.layout',
      className: 'col-lg-4',
      templateOptions: { label: 'layout.backend.headerMenuSelfLayout.label' },
      type: 'input',
      defaultValue: 'default'
    }, */
    {
      id: 'headerMenuSelfRootArrow',
      type: 'checkbox',
      value: false
    },
    /*
    {
          key: 'header.menu.desktop.toggle',
          className: 'col-lg-4',
          templateOptions: { label: 'layout.backend.headerMenuDesktopToggle.label' },
          type: 'input',
          defaultValue: 'click'
        },*/
    {
      id: 'headerMenuDesktopToggle',
      value: 'click'
    },
    {
      id: 'headerMenuDesktopArrow',
      type: 'checkbox',
      value: true
    },
    {
      id: 'headerMenuDesktopSubmenuSkin',
      type: 'radio',
      value: 'light',
      options: [
        { value: 'dark', label: 'layout.backend.dark' },
        { value: 'light', label: 'layout.backend.light' }
      ]
    },
    {
      id: 'headerMenuDesktopSubmenuArrow',
      type: 'checkbox',
      value: true
    },
    {
      id: 'headerMenuMobileSubmenuSkin',
      type: 'radio',
      value: 'dark',
      options: [
        { value: 'light', label: 'layout.backend.light' },
        { value: 'dark', label: 'layout.backend.dark' }
      ]
    },
    {
      id: 'headerMenuMobileSubmenuAccordion',
      type: 'checkbox',
      value: true
    },
    {
      id: 'loaderEnabled',
      type: 'checkbox',
      value: true
    },
    {
      id: 'loaderType',
      type: 'select',
      value: 'spinner-logo',
      options: [
        { value: 'spinner-logo', label: 'layout.backend.spinner-logo' },
        { value: 'spinner-message', label: 'layout.backend.spinner-message' },
        { value: 'spinner-message-logo', label: 'layout.backend.spinner-message-logo' }
      ]
    },
    {
      id: 'loaderLogo',
      value: './assets/media/logos/logo-mini-md.png'
    },
    {
      id: 'loaderMessage',
      value: 'Please wait...'
    },
    {
      id: 'portletStickyOffset',
      type: 'number',
      value: 50
    },
    {
      id: 'selfBodyBackgroundImage',
      type: 'radio',
      value: './assets/media/misc/bg-1.jpg',
      options: [
        { value: './assets/media/misc/bg-1.jpg', label: 'layout.backend../assets/media/misc/bg-1.jpg' },
        { value: './assets/media/misc/bg-2.jpg', label: 'layout.backend../assets/media/misc/bg-2.jpg' }
      ]
    },
    {
      id: 'selfLayout',
      type: 'radio',
      value: 'fluid',
      options: [
        { value: 'boxed', label: 'layout.backend.boxed' },
        { value: 'fluid', label: 'layout.backend.fluid' }
      ]
    },
    {
      id: 'selfLogoDark',
      value: './assets/media/logos/logo-light.png'
    },
    {
      id: 'selfLogoBrand',
      value: './assets/media/logos/logo-light.png'
    },
    {
      id: 'selfLogoGreen',
      value: './assets/media/logos/logo-light.png'
    },
    {
      id: 'selfLogoLight',
      value: './assets/media/logos/logo-dark.png'
    },
    {
      id: 'selfLogo',
      type: 'select',
      value: './assets/media/logos/logo-light.png',
      options: [
        { value: './assets/media/logos/logo-dark.png', label: 'layout.backend../assets/media/logos/logo-dark.png' },
        { value: './assets/media/logos/logo-light.png', label: './assets/media/logos/logo-light.png' },
        { value: './assets/media/logos/logo-2.png', label: 'layout.backend../assets/media/logos/logo-2.png' },
        { value: './assets/media/logos/logo-3.png', label: 'layout.backend../assets/media/logos/logo-3.png' },
        { value: './assets/media/logos/logo-4.png', label: 'layout.backend../assets/media/logos/logo-4.png' },
        { value: './assets/media/logos/logo-5.png', label: 'layout.backend../assets/media/logos/logo-5.png' },
        { value: './assets/media/logos/logo-6.png', label: 'layout.backend../assets/media/logos/logo-6.png' },
        { value: './assets/media/logos/logo-7.png', label: 'layout.backend../assets/media/logos/logo-7.png' },
        { value: './assets/media/logos/logo-8.png', label: 'layout.backend../assets/media/logos/logo-8.png' },
        { value: './assets/media/logos/logo-9.png', label: 'layout.backend../assets/media/logos/logo-9.png' },
        { value: './assets/media/logos/logo-10.png', label: 'layout.backend../assets/media/logos/logo-10.png' },
        { value: './assets/media/logos/logo-11.png', label: 'layout.backend../assets/media/logos/logo-11.png' },
        { value: './assets/media/logos/logo-12.png', label: 'layout.backend../assets/media/logos/logo-12.png' }
      ]
    },
    {
      id: 'selfLogoSticky',
      type: 'select',
      value: './assets/media/logos/logo-dark.png',
      options: [
        { value: './assets/media/logos/logo-dark.png', label: 'layout.backend../assets/media/logos/logo-dark.png' },
        { value: './assets/media/logos/logo-light.png', label: './assets/media/logos/logo-light.png' },
        { value: './assets/media/logos/logo-2.png', label: 'layout.backend../assets/media/logos/logo-2.png' },
        { value: './assets/media/logos/logo-3.png', label: 'layout.backend../assets/media/logos/logo-3.png' },
        { value: './assets/media/logos/logo-4.png', label: 'layout.backend../assets/media/logos/logo-4.png' },
        { value: './assets/media/logos/logo-5.png', label: 'layout.backend../assets/media/logos/logo-5.png' },
        { value: './assets/media/logos/logo-6.png', label: 'layout.backend../assets/media/logos/logo-6.png' },
        { value: './assets/media/logos/logo-7.png', label: 'layout.backend../assets/media/logos/logo-7.png' },
        { value: './assets/media/logos/logo-8.png', label: 'layout.backend../assets/media/logos/logo-8.png' },
        { value: './assets/media/logos/logo-9.png', label: 'layout.backend../assets/media/logos/logo-9.png' },
        { value: './assets/media/logos/logo-10.png', label: 'layout.backend../assets/media/logos/logo-10.png' },
        { value: './assets/media/logos/logo-11.png', label: 'layout.backend../assets/media/logos/logo-11.png' },
        { value: './assets/media/logos/logo-12.png', label: 'layout.backend../assets/media/logos/logo-12.png' }
      ]
    },
    {
      id: 'subheaderClear',
      type: 'checkbox',
      value: true
    },
    {
      id: 'subheaderDisplay',
      type: 'checkbox',
      value: false
    },
    {
      id: 'subheaderFixed',
      type: 'checkbox',
      value: true
    },
    {
      id: 'subheaderLayout',
      type: 'select',
      value: 'subheader-v1',
      options: [
        { value: 'subheader-v1', label: 'layout.backend.subheader-v1' },
        { value: 'subheader-v2', label: 'layout.backend.subheader-v2' },
        { value: 'subheader-v3', label: 'layout.backend.subheader-v3' },
        { value: 'subheader-v4', label: 'layout.backend.subheader-v4' },
        { value: 'subheader-v5', label: 'layout.backend.subheader-v5' }
      ]
    },
    {
      id: 'subheaderStyle',
      type: 'select',
      value: 'solid',
      options: [
        { value: 'light', label: 'layout.backend.light' },
        { value: 'dark', label: 'layout.backend.dark' },
        { value: 'solid', label: 'layout.backend.solid' },
        { value: 'transparent', label: 'layout.backend.transparent' }
      ]
    },
    {
      id: 'subheaderWidth',
      type: 'radio',
      value: 'fluid',
      options: [
        { value: 'fluid', label: 'layout.backend.subheader.width.fluid' },
        { value: 'fixed', label: 'layout.backend.subheader.width.fixed' }
      ]
    }
  ];

  public get backendConfigs(): MenuItem[] {
    return this.backendDefaults;
  }

}
