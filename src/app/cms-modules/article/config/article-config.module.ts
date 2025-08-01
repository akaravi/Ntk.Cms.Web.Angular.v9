import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  ArticleConfigurationService, CoreModuleService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared/shared.module';
import { ArticleConfigRouting } from './article-config.routing';
import { ArticleConfigCheckSiteComponent } from './check-site/check-site.component';
import { ArticleConfigCheckUserComponent } from './check-user/check-user.component';
import { ArticleConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ArticleConfigSiteComponent } from './site/config-site.component';
import { ArticleConfigComponent } from './article-config.component';
@NgModule({
  declarations: [
    ArticleConfigComponent,
    /*Config*/
    ArticleConfigMainAdminComponent,
    ArticleConfigSiteComponent,
    ArticleConfigCheckUserComponent,
    ArticleConfigCheckSiteComponent,
    /*Config*/
  ],
  providers: [
    CoreModuleService,
    ArticleConfigurationService,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ArticleConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule,
    AngularEditorModule,
  ],
  exports: [
    /*Config*/
    ArticleConfigMainAdminComponent,
    ArticleConfigSiteComponent,
    ArticleConfigCheckUserComponent,
    ArticleConfigCheckSiteComponent,
    /*Config*/
  ],
})
export class ArticleConfigModule {
}
