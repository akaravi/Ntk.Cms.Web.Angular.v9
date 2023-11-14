import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsAuthGuard } from 'src/app/core/services/cmsAuthGuard.service';
import { PageAboutComponent } from './page-about/page-about.component';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageIndexComponent } from './page-index/page-index.component';
import { PagePanelComponent } from './page-panel/page-panel.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        component: PageIndexComponent,
      },
      {
        path: 'about',
        component: PageAboutComponent,
      },
      {
        path: 'panel0',
        component: PagePanelComponent,
      },
      {
        path: 'auth',
        loadChildren: () => import('../../cms-modules/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'dashboard',
        canActivate: [CmsAuthGuard],
        component: PageDashboardComponent,
      },
      {
        path: 'panel',
        canActivate: [CmsAuthGuard],
        loadChildren: () =>
          import('../../cms-modules/cms-modules.module').then((m) => m.CmsModulesModule),
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
