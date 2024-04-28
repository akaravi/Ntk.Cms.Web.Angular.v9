import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-page-aboutus',
  templateUrl: './page-aboutus.component.html',
  styleUrls: ['./page-aboutus.component.scss']
})
export class PageAboutusComponent implements OnInit {

  constructor(public pageInfo: PageInfoService, public translate: TranslateService,) { }

  ngOnInit(): void {
    this.pageInfo.updateTitle(this.translate.instant('ACTION.ABOUT'));
  }

}
