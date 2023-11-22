import { Component, OnInit } from '@angular/core';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';
import { ThemeModeService } from 'src/app/core/services/themeMode.service';

@Component({
  selector: 'app-menu-colors',
  templateUrl: './menu-colors.component.html',
  styleUrls: ['./menu-colors.component.scss']
})
export class MenuColorsComponent implements OnInit {

  constructor(
    private publicHelper: PublicHelper,
    private themeModeService: ThemeModeService,
  ) {
    this.publicHelper.getReducerCmsStoreOnChange().subscribe((value) => {
      this.themeStore = value.themeStore;
    });

  }
  themeStore = new ThemeStoreModel();

  ngOnInit(): void {
    this.publicHelper.getReducerCmsStoreOnChange().subscribe((value) => {
      this.themeStore = value.themeStore;
    });
  }
  onActionHighLightSwitch(colorStr: string) {
    this.themeModeService.updateHighLight(colorStr);
  }
}
