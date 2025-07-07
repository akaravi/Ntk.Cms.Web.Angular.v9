import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  ApiTelegramConfigurationService, CoreModuleService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApiTelegramConfigRouting } from './api-telegram-config.routing';
import { ApiTelegramConfigCheckSiteComponent } from './check-site/check-site.component';
import { ApiTelegramConfigCheckUserComponent } from './check-user/check-user.component';
import { ApiTelegramConfigMainAdminComponent } from './main-admin/config-main-admin.component';
import { ApiTelegramConfigSiteComponent } from './site/config-site.component';
import { ApiTelegramConfigComponent } from './api-telegram-config.component';
@NgModule({
  declarations: [
    ApiTelegramConfigComponent,
    /*Config*/
    ApiTelegramConfigMainAdminComponent,
    ApiTelegramConfigSiteComponent,
    ApiTelegramConfigCheckUserComponent,
    ApiTelegramConfigCheckSiteComponent,
    /*Config*/
  ],
  providers: [
    CoreModuleService,
    ApiTelegramConfigurationService,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ApiTelegramConfigRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule,
    AngularEditorModule,
  ],
  exports: [
    /*Config*/
    ApiTelegramConfigMainAdminComponent,
    ApiTelegramConfigSiteComponent,
    ApiTelegramConfigCheckUserComponent,
    ApiTelegramConfigCheckSiteComponent,
    /*Config*/
  ],
})
export class ApiTelegramConfigModule {
}
