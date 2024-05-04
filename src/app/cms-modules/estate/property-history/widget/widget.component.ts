
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EstatePropertyHistoryService, FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel, ManageUserAccessDataTypesEnum, RecordStatusEnum } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetContentInfoModel, WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-property-history-widget',
  templateUrl: './widget.component.html',

})

export class EstatePropertyHistoryWidgetComponent implements OnInit, OnDestroy {
  @Input() cssClass = '';
  @Input() widgetHeight = '200px';
  @Input() baseColor = 'success';
  @Input() iconColor = 'success';
  textInverseCSSClass;
  svgCSSClass;
  constructor(
    private service: EstatePropertyHistoryService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  filteModelContent = new FilterModel();
  modelData = new Map<string, number>();
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
    this.widgetInfoModel.title = this.translate.instant('ROUTE.ESTATE.HISTORY');
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/estate/property-history';

    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
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
    this.loading.Start(this.constructor.name + 'InChecking');
    this.loading.Start(this.constructor.name + 'Active');
    this.loading.Start(this.constructor.name + 'All');

    this.widgetInfoModel.setItem(new WidgetContentInfoModel('InChecking', 2, 0, ''));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('Active', 0, 0, ''));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('All', 1, 0, ''));

    this.service.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
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
    let fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'RecordStatus';
    fastfilter.value = RecordStatusEnum.Available;
    filterStatist1.filters.push(fastfilter);
    this.service.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.service.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.widgetInfoModel.setItem(new WidgetContentInfoModel('Active', 0, ret.totalRowCount, this.widgetInfoModel.link));
        }
        this.loading.Stop(this.constructor.name + 'Active');
      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'Active');
      }
    }
    );
    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'RecordStatus';
    fastfilter.value = RecordStatusEnum.Available;
    fastfilter.searchType = FilterDataModelSearchTypesEnum.NotEqual;
    filterStatist2.filters.push(fastfilter);
    this.service.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.service.ServiceGetCount(filterStatist2).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          if (ret.totalRowCount > 0) {
            this.modelData.set('InChecking', ret.totalRowCount);
            this.widgetInfoModel.link = '/estate/property-history/InChecking/true';
          }
          else {
            this.modelData.delete('InChecking');
            this.widgetInfoModel.link = '/estate/property-history';
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(this.constructor.name + 'InChecking');
      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'InChecking');
      }
    }
    );
  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
