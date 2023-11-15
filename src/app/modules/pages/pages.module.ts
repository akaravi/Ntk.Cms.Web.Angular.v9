import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages.routing';
import { PagesComponent } from '../pages/pages.component';
import { PageIndexComponent } from './page-index/page-index.component';
import { PageAboutComponent } from './page-about/page-about.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    PagesComponent,
    PageIndexComponent,
    PageAboutComponent,

  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ComponentsModule,
    SharedModule.forRoot(),
  ]
})
export class PagesModule { }
