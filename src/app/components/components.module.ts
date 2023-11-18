import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuMainComponent } from './menu-main/menu-main.component';
import { MenuShareComponent } from './menu-share/menu-share.component';
import { MenuColorsComponent } from './menu-colors/menu-colors.component';
import { MenuFooterComponent } from './menu-footer/menu-footer.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { CoreCpMainMenuService } from 'ntk-cms-api';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MenuMainComponent,
    MenuShareComponent,
    MenuColorsComponent,
    MenuFooterComponent,
    HeaderBarComponent,
    FooterBarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    MenuMainComponent,
    MenuShareComponent,
    MenuColorsComponent,
    MenuFooterComponent,
    HeaderBarComponent,
    FooterBarComponent,
  ],
  providers: [
    CoreCpMainMenuService
  ]
})

export class ComponentsModule { }