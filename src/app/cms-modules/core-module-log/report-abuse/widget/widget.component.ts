
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleLogReportAbuseService, FilterDataModel, FilterModel, RecordStatusEnum } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { WidgetContentInfoModel, WidgetInfoModel } from 'src/app/core/models/widget-info-model';
@Component({
  selector: 'app-ReportAbuse-widget',
  templateUrl: './widget.component.html',
})
export class CoreModuleLogReportAbuseWidgetComponent implements OnInit, OnDestroy {


  constructorInfoAreaId = this.constructor.name;
  constructor(
    private service: CoreModuleLogReportAbuseService,
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
    this.widgetInfoModel.title = this.translate.instant('TITLE.Report_Abuse');
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/coremodulelog/report-abuse';
    setTimeout(() => {
      if (!this.firstLoadDataRunned)
        this.onActionStatist();
    }, 500);

    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.firstLoadDataRunned = true;
        this.onActionStatist();
      }
    });

  }
  firstLoadDataRunned = false;
  onActionButtonReload(): void {
    this.onActionStatist();
  }

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionStatist(): void {
    this.publicHelper.processService.processStart(this.constructor.name + 'Pending', this.translate.instant('MESSAGE.Get_pending_report_abuse'), this.constructorInfoAreaId);
    this.publicHelper.processService.processStart(this.constructor.name + 'All', this.translate.instant('MESSAGE.Get_all_report_abuse'), this.constructorInfoAreaId);

    this.widgetInfoModel.setItem(new WidgetContentInfoModel('Pending', 0, 0, ''));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('All', 1, 0, ''));

    this.service.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.widgetInfoModel.setItem(new WidgetContentInfoModel('All', 1, ret.totalRowCount, this.widgetInfoModel.link));
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
    fastfilter.value = RecordStatusEnum.Pending;
    filterStatist1.filters.push(fastfilter);

    this.service.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {

          this.widgetInfoModel.setItem(new WidgetContentInfoModel('Pending', 0, ret.totalRowCount, this.widgetInfoModel.link));
        }
        this.publicHelper.processService.processStop(this.constructor.name + 'Pending');
      },
      error: (er) => {
        this.publicHelper.processService.processStop(this.constructor.name + 'Pending');
      }
    }
    );
  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
