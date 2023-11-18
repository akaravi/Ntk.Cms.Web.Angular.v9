import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreConfigurationService, CoreCpMainMenuService } from 'ntk-cms-api';
import { ComponentsModule } from 'src/app/components/components.module';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageMenuComponent } from './page-menu/page-menu.component';
import { PanelComponent } from './panel.component';
import { PagesPanelRoutingModule } from './panel.routing';


@NgModule({
  declarations: [
    PanelComponent,
    PageDashboardComponent,
    PageMenuComponent
    // CmsModulesComponent,
    // AsideComponent,
    // HeaderComponent,
    // ContentComponent,
    // FooterComponent,
    // ScriptsInitComponent,
    // ToolbarComponent,
    // AsideMenuComponent,
    // TopbarComponent,
    // PageTitleComponent,
    // HeaderMenuComponent,
    // EngagesComponent,
  ],
  imports: [
    CommonModule,
    PagesPanelRoutingModule,
    //RouterModule.forChild(routes),
    // SharedModule.forRoot(),
    // InlineSVGModule,
    // NgbDropdownModule,
    // NgbProgressbarModule,
    // ExtrasModule,
    // ModalsModule,
    // DrawersModule,
    // EngagesModule,
    // DropdownMenusModule,
    // NgbTooltipModule,
    // ThemeModeModule,
    ComponentsModule,
  ],
  exports: [RouterModule],
  providers: [
    CoreCpMainMenuService,
    CoreConfigurationService
  ]
})
export class PanelModule { }
