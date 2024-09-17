import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SmsComponent } from './sms.component';
import { SmsRoutes } from './sms.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import {
  CoreAuthService,
  CoreEnumService, CoreModuleService, CoreModuleTagService, SmsEnumService, SmsMainApiPathPriceServiceService
} from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { SmsSharedModule } from './sms.shared.module';
import { SmsMessageTypeEnumSelectionlistComponent } from './shared/sms-message-type-enum/selectionlist/selectionlist.component';
import { SmsMessageTypeEnumSelectorComponent } from './shared/sms-message-type-enum/selector/selector.component';
import { SmsOutBoxTypeEnumSelectionlistComponent } from './shared/sms-out-box-type-enum/selectionlist/selectionlist.component';
import { SmsOutBoxTypeEnumSelectorComponent } from './shared/sms-out-box-type-enum/selector/selector.component';

@NgModule({
  declarations: [
    SmsComponent,
    SmsMessageTypeEnumSelectionlistComponent,
    SmsMessageTypeEnumSelectorComponent,
    SmsOutBoxTypeEnumSelectionlistComponent,
    SmsOutBoxTypeEnumSelectorComponent,
  ],
  imports: [
    CommonModule,
    SmsRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

    SharedModule,
    AngularEditorModule,


    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    SmsSharedModule,

  ],
  providers: [
    CoreModuleService,
    CoreEnumService,
    CoreAuthService,
    /*Config*/
    CmsConfirmationDialogService,
    /*Config*/
    CmsConfirmationDialogService,
    SmsEnumService,
    CoreModuleTagService,
    SmsMainApiPathPriceServiceService,
  ]
})
export class SmsModule { }
