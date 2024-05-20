import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PagesComponent } from '../pages/pages.component';
import { PageAboutusComponent } from './page-aboutus/page-aboutus.component';
import { PageContactusComponent } from './page-contactus/page-contactus.component';
import { PageIndexComponent } from './page-index/page-index.component';
import { PagesRoutingModule } from './pages.routing';



@NgModule({
  declarations: [
    PagesComponent,
    PageIndexComponent,
    PageAboutusComponent,
    PageContactusComponent,

  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ComponentsModule,
    SharedModule.forRoot(),
  ]
})
export class PagesModule { }
