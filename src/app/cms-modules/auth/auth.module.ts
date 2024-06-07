import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreAuthService, CoreConfigurationService, CoreModuleService } from 'ntk-cms-api';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgOtpInputModule } from 'src/app/core/cmsComponent/ng-otp-input/ng-otp-input.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth.routing';
import { AuthForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthSingInBySmsComponent } from './singin-bysms/singin-bysms.component';
import { AuthSingInComponent } from './singin/singin.component';
import { AuthSingoutComponent } from './singout/singout.component';
import { AuthSingUpComponent } from './singup/singup.component';
import { SingupRuleComponent } from './singupRule/singupRule.Component';

@NgModule({ declarations: [
        AuthSingInComponent,
        AuthSingInBySmsComponent,
        AuthSingUpComponent,
        AuthForgotPasswordComponent,
        AuthSingoutComponent,
        AuthComponent,
        SingupRuleComponent,
    ], imports: [CommonModule,
        SharedModule.forRoot(),
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentsModule,
        NgOtpInputModule], providers: [
        CoreModuleService,
        CoreConfigurationService,
        CoreAuthService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AuthModule { }
