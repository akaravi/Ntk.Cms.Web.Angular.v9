import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-page-contactus',
  templateUrl: './page-contactus.component.html',
  styleUrls: ['./page-contactus.component.scss']
})
export class PageContactusComponent implements OnInit {
  constructor(public pageInfo: PageInfoService, public translate: TranslateService,) { }

  ngOnInit(): void {
    this.pageInfo.updateTitle(this.translate.instant('ACTION.CONTACT'));
  }

}
