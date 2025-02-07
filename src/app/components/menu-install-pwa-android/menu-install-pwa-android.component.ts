import { Component, OnInit } from '@angular/core';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';

@Component({
    selector: 'app-menu-install-pwa-android',
    templateUrl: './menu-install-pwa-android.component.html',
    styleUrls: ['./menu-install-pwa-android.component.scss'],
    standalone: false
})
export class MenuInstallPwaAndroidComponent implements OnInit {

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
