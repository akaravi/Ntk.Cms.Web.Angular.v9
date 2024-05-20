import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsAuthSiteGuard } from 'src/app/core/services/cmsAuthSiteGuard.service';
import { CoreComponent } from './core.component';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    data: { title: 'ROUTE.CORE' },

    children: [
      /* Config */
      {
        path: 'config',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./config/core-config.module').then((m) => m.CoreConfigModule),
        data: { title: 'ROUTE.CORE' },
      },
      /* Config */
      {
        path: 'action',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./action/core-main-action.module').then((m) => m.CoreMainActionModule),
        data: { title: 'ROUTE.CORE.ACTION' },
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/coreUser.module').then((m) => m.CoreUserModule),
        data: { title: 'ROUTE.CORE.USER' },
      },
      {
        path: 'usergroup',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./user-group/coreUserGroup.module').then(
            (m) => m.CoreUserGroupCmsModule
          ),
        data: { title: 'ROUTE.CORE.USERGROUP' },
      },
      {
        path: 'user-support-access',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./user-support-access/core-user-support-access.module').then(
            (m) => m.CoreUserSupportAccessCmsModule
          ),
        data: { title: 'ROUTE.CORE.USERSUPPORT' },
      },
      {
        path: 'currency',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./currency/coreCurrency.module').then(
            (m) => m.CoreCurrencyCmsModule
          ),
      },
      {
        path: 'site',
        loadChildren: () =>
          import('./site/coreSite.module').then((m) => m.CoreSiteModule),
        data: { title: 'ROUTE.CORE.SITE' },
      },
      {
        path: 'sitecategory',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./site-category/coreSiteCategory.module').then(
            (m) => m.CoreSiteCategoryCmsModule
          ),
        data: { title: 'ROUTE.CORE.SITECATEGORY' },
      },
      {
        path: 'sitecategorymodule',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import(
            './site-category-module/coreSiteCategoryCmsModule.module'
          ).then((m) => m.CoreSiteCategoryCmsModuleModule),
        data: { title: 'ROUTE.CORE.SITECATEGORYMODULE' },
      },
      {
        path: 'sitedomainalias',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./site-domain-alias/coreSiteDomainAlias.module').then(
            (m) => m.CoreSiteDomainAliasModule
          ),
        data: { title: 'ROUTE.CORE.SITEDOMAINALIAS' },
      },
      {
        path: 'cpmainmenu',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./cp-main-menu/coreCpMainMenu.module').then(
            (m) => m.CoreCpMainMenu
          ),
        data: { title: 'ROUTE.CORE.CPMAINMENU' },
      },
      {
        path: 'module',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./module/coreModule.module').then((m) => m.CoreModuleModule),
        data: { title: 'ROUTE.CORE.MODULE' },
      },
      {
        path: 'module-entity',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./module-entity/core-module-entity.module').then(
            (m) => m.CoreModuleEntityModule
          ),
        data: { title: 'ROUTE.CORE.MODULEENTITY' },
      },
      {
        path: 'module-entity-report-file',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import(
            './module-entity-report-file/core-module-entity-report-file.module'
          ).then((m) => m.CoreModuleEntityReportFileModule),
        data: { title: 'ROUTE.CORE.ENTITYREPORTFILE' },
      },
      {
        path: 'modulesale',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./module-sale/core-module-sale.module').then(
            (m) => m.CoreModuleSaleModule
          ),
        data: { title: 'ROUTE.CORE.MODULESALE' },
      },
      {
        path: 'userclaim',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./user-claim/core-user-claim.module').then(
            (m) => m.CoreUserClaimModule
          ),
        data: { title: 'ROUTE.CORE.USERCLAIM' },
      },
      {
        path: 'location',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./location/coreLocation.module').then(
            (m) => m.CoreLocationCmsModule
          ),
        data: { title: 'ROUTE.CORE.LOCATION' },
      },
      {
        path: 'device',
        canActivate: [CmsAuthSiteGuard],
        loadChildren: () =>
          import('./device/coreDevice.module').then((m) => m.CoreDeviceModule),
        data: { title: 'ROUTE.CORE.DEVICE' },
      },
      {
        path: 'guide',
        loadChildren: () =>
          import('./guides/coreGuide.module').then((m) => m.CoreGuideCmsModule),
        data: { title: 'ROUTE.CORE.GUIDE' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutes { }
