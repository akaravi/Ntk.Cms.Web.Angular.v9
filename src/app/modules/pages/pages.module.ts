import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from '../pages/pages.component';
import { PageIndexComponent } from './page-index/page-index.component';
import { PagePanelComponent } from './page-panel/page-panel.component';
import { PageAboutComponent } from './page-about/page-about.component';
import { MenusModule } from '../menus/menus.module';


@NgModule({
  declarations: [
    PagesComponent,
    PageIndexComponent,
    PageAboutComponent,
    PagePanelComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MenusModule,
  ]
})
export class PagesModule { }
