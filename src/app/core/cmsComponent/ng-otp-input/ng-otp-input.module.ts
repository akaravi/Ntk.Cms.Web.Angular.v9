import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NumberOnlyDirective } from '../../directive/number-only.directive';
import { KeysPipe } from '../../pipe/keys.pipe';
import { NgOtpInputComponent } from './ng-otp-input.component';

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
