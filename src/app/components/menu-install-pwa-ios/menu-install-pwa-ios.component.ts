import { Component, OnInit } from '@angular/core';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';

@Component({
  selector: 'app-menu-install-pwa-ios',
  templateUrl: './menu-install-pwa-ios.component.html',
  styleUrls: ['./menu-install-pwa-ios.component.scss']
})
export class MenuInstallPwaIosComponent implements OnInit {

  constructor(
    public publicHelper: PublicHelper,
  ) { }
  themeStore = new ThemeStoreModel();

  ngOnInit(): void {
    this.publicHelper.getReducerCmsStoreOnChange().subscribe((value) => {
      this.themeStore = value.themeStore;
    });
  }

}
