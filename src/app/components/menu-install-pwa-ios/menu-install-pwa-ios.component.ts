import { Component, OnInit } from '@angular/core';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';

@Component({
    selector: 'app-menu-install-pwa-ios',
    templateUrl: './menu-install-pwa-ios.component.html',
    styleUrls: ['./menu-install-pwa-ios.component.scss'],
    standalone: false
})
export class MenuInstallPwaIosComponent implements OnInit {

  constructor(
    public publicHelper: PublicHelper,
  ) { }
  themeStore = new ThemeStoreModel();

  ngOnInit(): void {
    this.publicHelper.getStateOnChange().subscribe((value) => {
      this.themeStore = value.themeStore;
    });
  }

}
