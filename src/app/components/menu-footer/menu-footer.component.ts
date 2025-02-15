import { Component, OnInit } from '@angular/core';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
    selector: 'app-menu-footer',
    templateUrl: './menu-footer.component.html',
    styleUrls: ['./menu-footer.component.scss'],
    standalone: false
})
export class MenuFooterComponent implements OnInit {

  constructor(
    private themeService: ThemeService,
    public publicHelper: PublicHelper

  ) { }

  ngOnInit(): void {
  }

  onActionCleanDataMenu(): void {
    this.themeService.cleanDataMenu();
  }
}
