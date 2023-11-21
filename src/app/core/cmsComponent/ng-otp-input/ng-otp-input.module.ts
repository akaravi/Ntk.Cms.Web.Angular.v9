import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgOtpInputComponent } from './ng-otp-input.component';
import { KeysPipe } from '../../pipe/keys.pipe';
import { NumberOnlyDirective } from '../../directive/number-only.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [NgOtpInputComponent, KeysPipe, NumberOnlyDirective],
  exports: [NgOtpInputComponent, KeysPipe, NumberOnlyDirective],
  providers: [KeysPipe]
})
export class NgOtpInputModule { }
