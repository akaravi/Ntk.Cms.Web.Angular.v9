import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BlogConfigurationService, CoreModuleService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared/shared.module';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { BlogConfigRouting } from './blog-config.routing';
import { BlogConfigCheckSiteComponent } from './check-site/check-site.component';
import { BlogConfigCheckUserComponent } from './check-user/check-user.component';
import { BlogConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { BlogConfigSiteComponent } from './site/config-site.component';
import { BlogConfigComponent } from './blog-config.component';


@NgModule({
  declarations: [
    BlogConfigComponent,
    /*Config*/
    BlogConfigMainAdminComponent,
    BlogConfigSiteComponent,
    BlogConfigCheckUserComponent,
    BlogConfigCheckSiteComponent,
    /*Config*/
  ],
  exports: [
    /*Config*/
    BlogConfigMainAdminComponent,
    BlogConfigSiteComponent,
    BlogConfigCheckUserComponent,
    BlogConfigCheckSiteComponent,
    /*Config*/
  ],
  imports: [
    CommonModule,
    FormsModule,
    BlogConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule,
    AngularEditorModule,
  ],
  providers: [
    CoreModuleService,
    BlogConfigurationService,
  ]
})
export class BlogConfigModule {
}
