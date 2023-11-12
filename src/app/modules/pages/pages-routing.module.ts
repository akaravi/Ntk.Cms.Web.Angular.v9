import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
        path: '500',
        component: PagePanelComponent,
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
