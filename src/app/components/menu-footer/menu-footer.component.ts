import { Component, OnInit } from '@angular/core';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-menu-footer',
  templateUrl: './menu-footer.component.html',
  styleUrls: ['./menu-footer.component.scss']
})
export class MenuFooterComponent implements OnInit {

  constructor(
    private themeService: ThemeService,

  ) { }

  ngOnInit(): void {
  }

  onActionCleanDataMenu(): void {
      this.themeService.cleanDataMenu();
  }
}
