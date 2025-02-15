import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CoreEnumService,
  CoreModuleService,
  CoreTokenActivationService,
  CoreLogTokenMicroServiceService,
  CoreTokenMicroServiceService,
  CoreLogTokenConnectionService,
  CoreTokenConnectionService,
  CoreTokenUserBadLoginService,
  CoreLogTokenUserService,
  CoreTokenUserService,
  CoreUserService
} from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreTokenActivationEditComponent } from './activation/edit/edit.component';
import { CoreTokenActivationListComponent } from './activation/list/list.component';
import { CoreTokenActivationViewComponent } from './activation/view/view.component';
import { CoreTokenComponent } from './core-token.component';
import { CoreTokenRoutes } from './core-token.routing';
import { CoreLogTokenMicroServiceEditComponent } from './micro-service-log/edit/edit.component';
import { CoreLogTokenMicroServiceListComponent } from './micro-service-log/list/list.component';
import { CoreLogTokenMicroServiceViewComponent } from './micro-service-log/view/view.component';
import { CoreTokenMicroServiceEditComponent } from './micro-service/edit/edit.component';
import { CoreTokenMicroServiceListComponent } from './micro-service/list/list.component';
import { CoreTokenMicroServiceViewComponent } from './micro-service/view/view.component';
import { CoreLogTokenConnectionEditComponent } from './notification-log/edit/edit.component';
import { CoreLogTokenConnectionListComponent } from './notification-log/list/list.component';
import { CoreLogTokenConnectionViewComponent } from './notification-log/view/view.component';
import { CoreTokenConnectionEditComponent } from './notification/edit/edit.component';
import { CoreTokenConnectionListComponent } from './notification/list/list.component';
import { CoreTokenConnectionListOnlineComponent } from './notification/list-online/list-online.component';
import { CoreTokenConnectionViewComponent } from './notification/view/view.component';
import { CoreTokenUserEditComponent } from './user/edit/edit.component';
import { CoreTokenUserListComponent } from './user/list/list.component';
import { CoreTokenUserViewComponent } from './user/view/view.component';
import { CoreTokenUserBadLoginEditComponent } from './userBadLogin/edit/edit.component';
import { CoreTokenUserBadLoginListComponent } from './userBadLogin/list/list.component';
import { CoreTokenUserBadLoginViewComponent } from './userBadLogin/view/view.component';
import { CoreLogTokenUserEditComponent } from './userLog/edit/edit.component';
import { CoreLogTokenUserListComponent } from './userLog/list/list.component';
import { CoreLogTokenUserViewComponent } from './userLog/view/view.component';

@NgModule({
  imports: [
    CoreTokenRoutes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule,
  ],
  declarations: [
    CoreTokenComponent,
    /** */
    CoreTokenUserListComponent,
    CoreTokenUserEditComponent,
    CoreTokenUserViewComponent,
    /** */
    CoreLogTokenUserListComponent,
    CoreLogTokenUserEditComponent,
    CoreLogTokenUserViewComponent,
    /** */
    CoreTokenUserBadLoginListComponent,
    CoreTokenUserBadLoginEditComponent,
    CoreTokenUserBadLoginViewComponent,
    /** */
    /** */
    CoreTokenActivationListComponent,
    CoreTokenActivationEditComponent,
    CoreTokenActivationViewComponent,
    /** */
    /** */
    CoreTokenMicroServiceListComponent,
    CoreTokenMicroServiceEditComponent,
    CoreTokenMicroServiceViewComponent,
    /** */
    /** */
    CoreLogTokenMicroServiceListComponent,
    CoreLogTokenMicroServiceEditComponent,
    CoreLogTokenMicroServiceViewComponent,
    /** */

    /** */
    CoreTokenConnectionListComponent,
    CoreTokenConnectionListOnlineComponent,
    CoreTokenConnectionEditComponent,
    CoreTokenConnectionViewComponent,
    /** */
    /** */
    CoreLogTokenConnectionListComponent,
    CoreLogTokenConnectionEditComponent,
    CoreLogTokenConnectionViewComponent,
    /** */

  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    CoreTokenUserService,
    CoreLogTokenUserService,
    CoreTokenUserBadLoginService,
    CoreTokenActivationService,
    CoreTokenMicroServiceService,
    CoreLogTokenMicroServiceService,
    CoreTokenConnectionService,
    CoreLogTokenConnectionService,
    CoreUserService,
    CmsConfirmationDialogService
  ]
})
export class CoreTokenModule { }
