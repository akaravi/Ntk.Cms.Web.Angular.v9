import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsAuthGuard } from './core/services/cmsAuthGuard.service';


export const routes: Routes = [

  {
    path: 'error',
    loadChildren: () =>
      import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: 'panel',
    canActivate: [CmsAuthGuard],
    loadChildren: () =>
      import('./modules/pages/page-panel/page-panel.module').then((m) => m.PagePanelModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/pages/pages.module').then((m) => m.PagesModule),
  },
  { path: '**', redirectTo: 'error/404' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
