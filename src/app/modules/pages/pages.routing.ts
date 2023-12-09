import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAboutusComponent } from './page-aboutus/page-aboutus.component';
import { PageContactusComponent } from './page-contactus/page-contactus.component';
import { PageIndexComponent } from './page-index/page-index.component';
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
        path: 'aboutus',
        component: PageAboutusComponent,
      },
      {
        path: 'contactus',
        component: PageContactusComponent,
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
