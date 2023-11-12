import { Routes } from '@angular/router';

const CmsModulesRouting: Routes = [
  //{
  //   path: 'dashboard',
  //   loadChildren: () =>
  //     import('./../../pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
  //   data: { title: 'ROUTE.DASHBOARD' },
  // },
  // {
  //   path: 'builder',
  //   loadChildren: () =>
  //     import('./../../pages/builder/builder.module').then((m) => m.BuilderModule),
  //   data: { title: 'ROUTE.BUILDER' },
  // },
  // {
  //   path: 'crafted/pages/profile',
  //   loadChildren: () =>
  //     import('./../../modules/profile/profile.module').then((m) => m.ProfileModule),
  //   data: { title: 'ROUTE.CRAFTED' },
  // },
  // {
  //   path: 'crafted/account',
  //   loadChildren: () =>
  //     import('./../../modules/account/account.module').then((m) => m.AccountModule),
  // },
  // {
  //   path: 'crafted/pages/wizards',
  //   loadChildren: () =>
  //     import('./../../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  // },
  // {
  //   path: 'crafted/widgets',
  //   loadChildren: () =>
  //     import('./../../modules/widgets-examples/widgets-examples.module').then(
  //       (m) => m.WidgetsExamplesModule
  //     ),
  // },
  // {
  //   path: 'apps/chat',
  //   loadChildren: () =>
  //     import('./../../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  //   data: { title: 'ROUTE.APPS.CHAT' },
  // },

  // ** cms */
  {
    path: 'core',
    loadChildren: () =>
      import('./core-main/core.module').then((m) => m.CoreModule),
    data: { title: 'ROUTE.CORE' },
  },
  {
    path: 'coremodule',
    loadChildren: () =>
      import('./core-module/coreModule.module').then(
        (m) => m.CoreModuleModule
      ),
    data: { title: 'ROUTE.COREMODULELOG' },
  },
  {
    path: 'coremodulelog',
    loadChildren: () =>
      import('./core-module-log/core-module-log.module').then(
        (m) => m.CoreModuleLogModule
      ),
  },
  {
    path: 'coremoduledata',
    loadChildren: () =>
      import('./core-module-data/core-module-data.module').then(
        (m) => m.CoreModuleDataModule
      ),
  },
  {
    path: 'coretoken',
    loadChildren: () =>
      import('./core-token/core-token.module').then(
        (m) => m.CoreTokenModule
      ),
  },
  {
    path: 'corelog',
    loadChildren: () =>
      import('./core-log/coreLog.module').then(
        (m) => m.CoreLogModule
      ),
  },
  {
    path: 'estate',
    loadChildren: () =>
      import('./estate/estate.module').then((m) => m.EstateModule),
    data: { title: 'ROUTE.ESTATE' },
  },

  {
    path: 'member',
    loadChildren: () =>
      import('./member/member.module').then((m) => m.MemberModule),
    data: { title: 'ROUTE.MEMBER' },
  },

  {
    path: 'application',
    loadChildren: () =>
      import('./application/application.module').then(
        (m) => m.ApplicationModule
      ),
    data: { title: 'ROUTE.APPLICATION' },
  },
  {
    path: 'apitelegram',
    loadChildren: () =>
      import('./api-telegram/api-telegram.module').then(
        (m) => m.ApiTelegramModule
      ),
  },

  {
    path: 'article',
    loadChildren: () =>
      import('./article/article.module').then(
        (m) => m.ArticleModule
      ),
    data: { title: 'ROUTE.ARTICLE' },
  },
  {
    path: 'bankpayment',
    loadChildren: () =>
      import('./bank-payment/bank-payment.module').then(
        (m) => m.BankPaymentModule
      ),
  },
  {
    path: 'biography',
    loadChildren: () =>
      import('./biography/biography.module').then(
        (m) => m.BiographyModule
      ),
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('./blog/blog.module').then((m) => m.BlogModule),
  },
  {
    path: 'catalog',
    loadChildren: () =>
      import('./catalog/catalog.module').then(
        (m) => m.CatalogModule
      ),
  },
  {
    path: 'hypershop',
    loadChildren: () =>
      import('./hyper-shop/hyper-shop.module').then(
        (m) => m.HyperShopModule
      ),
  },
  {
    path: 'linkmanagement',
    loadChildren: () =>
      import('./link-management/link-management.module').then(
        (m) => m.LinkManagementModule
      ),
  },

  {
    path: 'news',
    loadChildren: () =>
      import('./news/news.module').then((m) => m.NewsModule),
  },

  {
    path: 'chart',
    loadChildren: () =>
      import('./chart/chart.module').then((m) => m.ChartModule),
  },
  {
    path: 'filemanager',
    loadChildren: () =>
      import('./file-manager/file-manager.module').then(
        (m) => m.FileManagerModule
      ),
    data: { title: 'ROUTE.FILEMANAGER' },
  },
  {
    path: 'polling',
    loadChildren: () =>
      import('./polling/polling.module').then(
        (m) => m.PollingModule
      ),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./contact/contact.module').then(
        (m) => m.ContactModule
      ),
  },
  {
    path: 'sms',
    loadChildren: () =>
      import('./sms/sms.module').then((m) => m.SmsModule),
  },
  {
    path: 'ticketing',
    loadChildren: () =>
      import('./ticketing/ticketing.module').then(
        (m) => m.TicketingModule
      ),
    data: { title: 'ROUTE.TICKETING' },
  },
  {
    path: 'universalmenu',
    loadChildren: () =>
      import('./universal-menu/universal-menu.module').then(
        (m) => m.UniversalMenuModule
      ),
  },
  {
    path: 'webdesigner',
    loadChildren: () =>
      import('./web-designer/web-designer.module').then(
        (m) => m.WebDesignerModule
      ),
  },
  {
    path: 'web-designer-builder',
    loadChildren: () =>
      import('./web-designer-builder/web-designer-builder.module'
      ).then((m) => m.WebDesignerBuilderModule),
  },

  {
    path: 'donate',
    loadChildren: () =>
      import('./donate/donate.module').then((m) => m.DonateModule),
  },
  {
    path: 'data-provider',
    loadChildren: () =>
      import('./data-provider/data-provider.module').then(
        (m) => m.DataProviderModule
      ),
  },
  {
    path: 'api-telegram',
    loadChildren: () =>
      import('./api-telegram/api-telegram.module').then(
        (m) => m.ApiTelegramModule
      ),
  },
  // ** cms */
  // {
  //   path: '',
  //   redirectTo: '/dashboard',
  //   pathMatch: 'full',
  // },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { CmsModulesRouting };

