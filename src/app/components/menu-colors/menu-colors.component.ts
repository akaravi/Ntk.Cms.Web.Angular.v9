import { Component, OnInit } from '@angular/core';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
    selector: 'app-menu-colors',
    templateUrl: './menu-colors.component.html',
    styleUrls: ['./menu-colors.component.scss'],
    standalone: false
})
export class MenuColorsComponent implements OnInit {

  constructor(
    public publicHelper: PublicHelper,
    private themeService: ThemeService,
  ) {
    this.publicHelper.getStateOnChange().subscribe((value) => {
      this.themeStore = value.themeStore;
    });

  }
  themeStore = new ThemeStoreModel();

  ngOnInit(): void {
    this.publicHelper.getStateOnChange().subscribe((value) => {
      this.themeStore = value.themeStore;
    });

  }
  onActionHighLightSwitch(colorStr: string) {
    this.themeService.updateThemeHighLight(colorStr);
  }
}
