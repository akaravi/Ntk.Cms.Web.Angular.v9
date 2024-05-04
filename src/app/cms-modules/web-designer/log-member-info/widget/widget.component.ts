
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FilterDataModel, FilterModel, RecordStatusEnum, WebDesignerLogMemberInfoService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetContentInfoModel, WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-webdesigner-logmemberinfo-widget',
  templateUrl: './widget.component.html',

})
export class WebDesignerLogMemberInfoWidgetComponent implements OnInit, OnDestroy {
  @Input() cssClass = '';
  @Input() widgetHeight = '200px';
  @Input() baseColor = 'success';
  @Input() iconColor = 'success';
  textInverseCSSClass;
  svgCSSClass;
  constructor(
    private service: WebDesignerLogMemberInfoService,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  filteModelContent = new FilterModel();

  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  loading: ProgressSpinnerModel = new ProgressSpinnerModel();
  get optionLoading(): ProgressSpinnerModel {
    return this.loading;
  }
  @Input() set optionLoading(value: ProgressSpinnerModel) {
    this.loading = value;
  }
  ngOnInit() {
    this.widgetInfoModel.title = this.translate.instant('TITLE.Registered_Member');
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/application/content';
    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.widgetInfoModel.title = this.translate.instant('TITLE.Registered_Member');
      this.onActionStatist();
    });
    this.cssClass = `bg-${this.baseColor} ${this.cssClass}`;
    this.textInverseCSSClass = `text-inverse-${this.baseColor}`;
    this.svgCSSClass = `svg-icon--${this.iconColor}`;
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionStatist(): void {
    this.loading.Start(this.constructor.name + 'Active', this.translate.instant('MESSAGE.Get_active_registered_members'));
    this.loading.Start(this.constructor.name + 'All', this.translate.instant('MESSAGE.Get_all_registered_members'));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('Active', 0, 0, ''));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('All', 1, 0, ''));
    this.service.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.widgetInfoModel.setItem(new WidgetContentInfoModel('All', 1, ret.totalRowCount, this.widgetInfoModel.link));
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(this.constructor.name + 'All');
      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'All');
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
        this.loading.Stop(this.constructor.name + 'Active');
      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'Active');
      }
    }
    );
  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
