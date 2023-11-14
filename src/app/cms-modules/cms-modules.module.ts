import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreConfigurationService, CoreCpMainMenuService } from 'ntk-cms-api';
import { CmsModulesComponent } from './cms-modules.component';
import { CmsModulesRouting } from './cms-modules.routing';
import { MenusModule } from '../modules/menus/menus.module';

const routes: Routes = [
  {
    path: '',
    component: CmsModulesComponent,
    children: CmsModulesRouting,
  },
];

@NgModule({
  declarations: [
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
    RouterModule.forChild(routes),
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
    MenusModule,
  ],
  exports: [RouterModule],
  providers: [
    CoreCpMainMenuService,
    CoreConfigurationService
  ]
})
export class CmsModulesModule { }
