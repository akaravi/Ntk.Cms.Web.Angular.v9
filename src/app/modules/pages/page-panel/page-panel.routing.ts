import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageDashboardComponent } from '../page-dashboard/page-dashboard.component';

const CmsModulesRouting: Routes = [

  // ** cms */
  {
    path: 'core',
    loadChildren: () =>
      import('../../../cms-modules/core-main/core.module').then((m) => m.CoreModule),
    data: { title: 'ROUTE.CORE' },
  },
  {
    path: 'coremodule',
    loadChildren: () =>
      import('../../../cms-modules/core-module/coreModule.module').then(
        (m) => m.CoreModuleModule
      ),
    data: { title: 'ROUTE.COREMODULELOG' },
  },
  {
    path: 'coremodulelog',
    loadChildren: () =>
      import('../../../cms-modules/core-module-log/core-module-log.module').then(
        (m) => m.CoreModuleLogModule
      ),
  },
  {
    path: 'coremoduledata',
    loadChildren: () =>
      import('../../../cms-modules/core-module-data/core-module-data.module').then(
        (m) => m.CoreModuleDataModule
      ),
  },
  {
    path: 'coretoken',
    loadChildren: () =>
      import('../../../cms-modules/core-token/core-token.module').then(
        (m) => m.CoreTokenModule
      ),
  },
  {
    path: 'corelog',
    loadChildren: () =>
      import('../../../cms-modules/core-log/coreLog.module').then(
        (m) => m.CoreLogModule
      ),
  },
  {
    path: 'estate',
    loadChildren: () =>
      import('../../../cms-modules/estate/estate.module').then((m) => m.EstateModule),
    data: { title: 'ROUTE.ESTATE' },
  },

  {
    path: 'member',
    loadChildren: () =>
      import('../../../cms-modules/member/member.module').then((m) => m.MemberModule),
    data: { title: 'ROUTE.MEMBER' },
  },

  {
    path: 'application',
    loadChildren: () =>
      import('../../../cms-modules/application/application.module').then(
        (m) => m.ApplicationModule
      ),
    data: { title: 'ROUTE.APPLICATION' },
  },
  {
    path: 'apitelegram',
    loadChildren: () =>
      import('../../../cms-modules/api-telegram/api-telegram.module').then(
        (m) => m.ApiTelegramModule
      ),
  },

  {
    path: 'article',
    loadChildren: () =>
      import('../../../cms-modules/article/article.module').then(
        (m) => m.ArticleModule
      ),
    data: { title: 'ROUTE.ARTICLE' },
  },
  {
    path: 'bankpayment',
    loadChildren: () =>
      import('../../../cms-modules/bank-payment/bank-payment.module').then(
        (m) => m.BankPaymentModule
      ),
  },
  {
    path: 'biography',
    loadChildren: () =>
      import('../../../cms-modules/biography/biography.module').then(
        (m) => m.BiographyModule
      ),
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('../../../cms-modules/blog/blog.module').then((m) => m.BlogModule),
  },
  {
    path: 'catalog',
    loadChildren: () =>
      import('../../../cms-modules/catalog/catalog.module').then(
        (m) => m.CatalogModule
      ),
  },
  {
    path: 'hypershop',
    loadChildren: () =>
      import('../../../cms-modules/hyper-shop/hyper-shop.module').then(
        (m) => m.HyperShopModule
      ),
  },
  {
    path: 'linkmanagement',
    loadChildren: () =>
      import('../../../cms-modules/link-management/link-management.module').then(
        (m) => m.LinkManagementModule
      ),
  },

  {
    path: 'news',
    loadChildren: () =>
      import('../../../cms-modules/news/news.module').then((m) => m.NewsModule),
  },

  {
    path: 'chart',
    loadChildren: () =>
      import('../../../cms-modules/chart/chart.module').then((m) => m.ChartModule),
  },
  {
    path: 'filemanager',
    loadChildren: () =>
      import('../../../cms-modules/file-manager/file-manager.module').then(
        (m) => m.FileManagerModule
      ),
    data: { title: 'ROUTE.FILEMANAGER' },
  },
  {
    path: 'polling',
    loadChildren: () =>
      import('../../../cms-modules/polling/polling.module').then(
        (m) => m.PollingModule
      ),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('../../../cms-modules/contact/contact.module').then(
        (m) => m.ContactModule
      ),
  },
  {
    path: 'sms',
    loadChildren: () =>
      import('../../../cms-modules/sms/sms.module').then((m) => m.SmsModule),
  },
  {
    path: 'ticketing',
    loadChildren: () =>
      import('../../../cms-modules/ticketing/ticketing.module').then(
        (m) => m.TicketingModule
      ),
    data: { title: 'ROUTE.TICKETING' },
  },
  {
    path: 'universalmenu',
    loadChildren: () =>
      import('../../../cms-modules/universal-menu/universal-menu.module').then(
        (m) => m.UniversalMenuModule
      ),
  },
  {
    path: 'webdesigner',
    loadChildren: () =>
      import('../../../cms-modules/web-designer/web-designer.module').then(
        (m) => m.WebDesignerModule
      ),
  },
  {
    path: 'web-designer-builder',
    loadChildren: () =>
      import(
        '../../../cms-modules/web-designer-builder/web-designer-builder.module'
      ).then((m) => m.WebDesignerBuilderModule),
  },

  {
    path: 'donate',
    loadChildren: () =>
      import('../../../cms-modules/donate/donate.module').then((m) => m.DonateModule),
  },
  {
    path: 'data-provider',
    loadChildren: () =>
      import('../../../cms-modules/data-provider/data-provider.module').then(
        (m) => m.DataProviderModule
      ),
  },
  {
    path: 'api-telegram',
    loadChildren: () =>
      import('../../../cms-modules/api-telegram/api-telegram.module').then(
        (m) => m.ApiTelegramModule
      ),
  },
  // ** cms */
  {
    path: 'dashboard',
    component: PageDashboardComponent,
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  imports: [RouterModule.forChild(CmsModulesRouting)],
  exports: [RouterModule],
})
export class PagesPanelRoutingModule { }

