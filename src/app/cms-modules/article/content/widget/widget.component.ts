
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ArticleContentService, FilterDataModel, FilterModel, RecordStatusEnum } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { WidgetContentInfoModel, WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-article-content-widget',
  templateUrl: './widget.component.html',

})
export class ArticleContentWidgetComponent implements OnInit, OnDestroy {


  constructorInfoAreaId = this.constructor.name;
  constructor(
    private service: ArticleContentService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

  }
  filteModelContent = new FilterModel();

  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;


  ngOnInit() {
    this.widgetInfoModel.title = this.translate.instant('TITLE.Registered_Atricle');
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/article/content';

    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.tokenHelper.geTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.widgetInfoModel.title = this.translate.instant('TITLE.Registered_Atricle');
        this.onActionStatist();
      }
    });

  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionStatist(): void {
    this.publicHelper.processService.processStart(this.constructor.name + 'Active', this.translate.instant('MESSAGE.Get_active_article_statistics'), this.constructorInfoAreaId);
    this.publicHelper.processService.processStart(this.constructor.name + 'All', this.translate.instant('MESSAGE.Get_statistics_on_all_articles'), this.constructorInfoAreaId);
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('Active', 0, 0, ''));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('All', 1, 0, ''));
    this.service.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.widgetInfoModel.setItem(new WidgetContentInfoModel('All', 1, ret.totalRowCount, this.widgetInfoModel.link));
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(this.constructor.name + 'All');
      },
      error: (er) => {
        this.publicHelper.processService.processStop(this.constructor.name + 'All');
      }
    }
    );
    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'RecordStatus';
    fastfilter.value = RecordStatusEnum.Available;
    filterStatist1.filters.push(fastfilter);
    this.service.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.widgetInfoModel.setItem(new WidgetContentInfoModel('Active', 0, ret.totalRowCount, this.widgetInfoModel.link));
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(this.constructor.name + 'Active');
      }
      ,
      error: (er) => {
        this.publicHelper.processService.processStop(this.constructor.name + 'Active');
      }
    }
    );
  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
