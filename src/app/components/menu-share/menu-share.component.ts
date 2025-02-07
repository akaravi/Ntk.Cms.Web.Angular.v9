import { Component, OnInit } from '@angular/core';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';

@Component({
    selector: 'app-menu-share',
    templateUrl: './menu-share.component.html',
    styleUrls: ['./menu-share.component.scss'],
    standalone: false
})
export class MenuShareComponent implements OnInit {

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
