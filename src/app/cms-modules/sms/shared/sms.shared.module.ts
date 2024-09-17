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
import { SmsMessageTypeEnumSelectionlistComponent } from './sms-message-type-enum/selectionlist/selectionlist.component';
import { SmsMessageTypeEnumSelectorComponent } from './/sms-message-type-enum/selector/selector.component';
import { SmsOutBoxTypeEnumSelectionlistComponent } from './sms-out-box-type-enum/selectionlist/selectionlist.component';
import { SmsOutBoxTypeEnumSelectorComponent } from './sms-out-box-type-enum/selector/selector.component';

@NgModule({
  declarations: [

    SmsMessageTypeEnumSelectionlistComponent,
    SmsMessageTypeEnumSelectorComponent,
    SmsOutBoxTypeEnumSelectionlistComponent,
    SmsOutBoxTypeEnumSelectorComponent,
  ],
  imports: [
    CommonModule,
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
    SmsEnumService,
  ]
})
export class SmsSharedModule { }
