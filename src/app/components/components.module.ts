import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreCpMainMenuService } from 'ntk-cms-api';
import { SharedModule } from '../shared/shared.module';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { MenuColorsComponent } from './menu-colors/menu-colors.component';
import { MenuFooterComponent } from './menu-footer/menu-footer.component';
import { MenuInstallPwaAndroidComponent } from './menu-install-pwa-android/menu-install-pwa-android.component';
import { MenuInstallPwaIosComponent } from './menu-install-pwa-ios/menu-install-pwa-ios.component';
import { MenuLanguageComponent } from './menu-language/menu-language.component';
import { MenuMainComponent } from './menu-main/menu-main.component';
import { MenuProfileComponent } from './menu-profile/menu-profile.component';
import { MenuShareComponent } from './menu-share/menu-share.component';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';



@NgModule({
  declarations: [
    MenuMainComponent,
    MenuShareComponent,
    MenuColorsComponent,
    MenuLanguageComponent,
    MenuProfileComponent,
    MenuFooterComponent,
    HeaderBarComponent,
    FooterBarComponent,
    MenuInstallPwaIosComponent,
    MenuInstallPwaAndroidComponent,
    ScrollTopComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule.forRoot(),
  ],
  exports: [
    MenuMainComponent,
    MenuShareComponent,
    MenuColorsComponent,
    MenuLanguageComponent,
    MenuProfileComponent,
    MenuFooterComponent,
    HeaderBarComponent,
    FooterBarComponent,
    MenuInstallPwaIosComponent,
    MenuInstallPwaAndroidComponent,
    ScrollTopComponent,
  ],
  providers: [
    CoreCpMainMenuService
  ]
})

export class ComponentsModule { }
