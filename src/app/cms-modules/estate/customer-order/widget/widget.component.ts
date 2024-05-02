
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EstateCustomerOrderService, FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel, ManageUserAccessDataTypesEnum, RecordStatusEnum } from 'ntk-cms-api';
import { Subscription, forkJoin } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ChartOptionsModel } from 'src/app/core/models/chartOptionsModel';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-customer-order-widget',
  templateUrl: './widget.component.html'
})

export class EstateCustomerOrderWidgetComponent implements OnInit, OnDestroy {
  @Input() cssClass = '';

  constructor(
    private service: EstateCustomerOrderService,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    /** chart*/
    this.chartOptions = {
      series: [],
      labels: [],
      chart: {
        width: 380,
        type: "pie"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    /** chart*/
  }
  public chartOptions: Partial<ChartOptionsModel>;
  modelData = new Map<string, number>();

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
  rowExist = false;
  ngOnInit() {
    this.widgetInfoModel.title = this.translate.instant('TITLE.Check_registered_properties');
    this.widgetInfoModel.description = this.translate.instant('TITLE.Introduction_of_your_customer_order');
    this.widgetInfoModel.link = '/estate/customer-order';

    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.onActionStatist();
    });

  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  async onActionStatist() {
    this.loading.Start(this.constructor.name + 'All', this.translate.instant('MESSAGE.property_list'));
    this.service.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    //*filter */
    const filterStatist0 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter0 = new FilterDataModel();
    fastfilter0.propertyName = 'RecordStatus';
    fastfilter0.value = RecordStatusEnum.Available;
    filterStatist0.filters.push(fastfilter0);
    const s0 = this.service.ServiceGetCount(filterStatist0);
    //*filter */
    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter1 = new FilterDataModel();
    fastfilter1.propertyName = 'RecordStatus';
    fastfilter1.value = RecordStatusEnum.Archive;
    filterStatist1.filters.push(fastfilter1);
    const s1 = this.service.ServiceGetCount(filterStatist1);
    //*filter */
    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter2 = new FilterDataModel();
    fastfilter2.propertyName = 'RecordStatus';
    fastfilter2.value = RecordStatusEnum.Pending;
    filterStatist2.filters.push(fastfilter2);
    const s2 = this.service.ServiceGetCount(filterStatist2);
    //*filter */
    const filterStatist3 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter3 = new FilterDataModel();
    fastfilter3.propertyName = 'RecordStatus';
    fastfilter3.value = RecordStatusEnum.Disable;
    filterStatist3.filters.push(fastfilter3);
    const s3 = this.service.ServiceGetCount(filterStatist3);
    var series = [];
    var labels = [];
    forkJoin([s0, s1, s2, s3]).subscribe(results => {
      //*results */
      var ret = results[0];
      series[0] = ret.totalRowCount;
      labels[0] = this.translate.instant('MESSAGE.customer_order_list_active');
      if (ret.isSuccess) {
        this.rowExist = true;
        this.widgetInfoModel.title = this.translate.instant('TITLE.Add_Property');
        this.widgetInfoModel.description = this.translate.instant('TITLE.Number_Registered_Property') + ' : ' + ret.totalRowCount;
        this.widgetInfoModel.link = '/estate/property/add';
      }
      else {
        this.widgetInfoModel.title = this.translate.instant('TITLE.Register_your_first_property');
        this.widgetInfoModel.link = '/estate/property/add';
      }
      //*results */
      ret = results[1];
      series[1] = ret.totalRowCount;
      labels[1] = this.translate.instant('MESSAGE.customer_order_list_close');
      if (ret.isSuccess) {
        this.modelData.set('InChecking', ret.totalRowCount);
      } else {
        this.cmsToastrService.typeErrorMessage(ret.errorMessage);
      }
      //*results */
      ret = results[2];
      series[2] = ret.totalRowCount;
      labels[2] = this.translate.instant('MESSAGE.customer_order_needs_approval');
      if (ret.isSuccess) {

      } else {
        this.cmsToastrService.typeErrorMessage(ret.errorMessage);
      }
      //*results */
      ret = results[3];
      series[3] = ret.totalRowCount;
      labels[3] = this.translate.instant('MESSAGE.customer_order_list_disable');
      if (ret.isSuccess) {

      } else {
        this.cmsToastrService.typeErrorMessage(ret.errorMessage);
      }
      this.loading.Stop(this.constructor.name + 'All');
      this.chartOptions.series = series;
      this.chartOptions.labels = labels;
    });

  }

  onActionStatist2222222222(): void {
    this.loading.Start(this.constructor.name + 'All', this.translate.instant('MESSAGE.customer_order_list'));
    this.loading.Start(this.constructor.name + 'Available', this.translate.instant('MESSAGE.customer_order_list_active'));
    this.loading.Start(this.constructor.name + 'Archive', this.translate.instant('MESSAGE.customer_order_list_close'));
    this.loading.Start(this.constructor.name + 'Disable', this.translate.instant('MESSAGE.customer_order_list_disable'));
    this.loading.Start(this.constructor.name + 'Pending', this.translate.instant('MESSAGE.customer_order_needs_approval'));
    this.service.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.service.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.rowExist = true;
          this.widgetInfoModel.title = this.translate.instant('TITLE.Add_CustomerOrder');
          this.widgetInfoModel.description = this.translate.instant('TITLE.Number_Registered_CustomerOrder') + ' : ' + ret.totalRowCount;
          this.widgetInfoModel.link = '/estate/customer-order/add';
        }
        else {
          this.widgetInfoModel.title = this.translate.instant('TITLE.Register_your_first_customer_order');
          this.widgetInfoModel.link = '/estate/customer-order/add';
        }
        this.loading.Stop(this.constructor.name + 'All');

      },
      error: (er) => {
        this.widgetInfoModel.title = this.translate.instant('TITLE.Add_new_properties');
        this.widgetInfoModel.link = '/estate/customer-order/add';
        this.loading.Stop(this.constructor.name + 'All');
      }
    }
    );
    /** Pending*/
    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    let fastfilter1 = new FilterDataModel();
    fastfilter1.propertyName = 'RecordStatus';
    fastfilter1.value = RecordStatusEnum.Pending;
    fastfilter1.searchType = FilterDataModelSearchTypesEnum.Equal;
    filterStatist2.filters.push(fastfilter1);

    this.service.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.service.ServiceGetCount(filterStatist2).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          if (ret.totalRowCount > 0) {
            this.modelData.set('Pending', ret.totalRowCount);
          }
          else {
            this.modelData.delete('Pending');
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(this.constructor.name + 'Pending');

      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'Pending');
      }
    }
    );
    /** Available */
    const filterStatist3 = JSON.parse(JSON.stringify(this.filteModelContent));
    fastfilter1 = new FilterDataModel();
    fastfilter1.propertyName = 'RecordStatus';
    fastfilter1.value = RecordStatusEnum.Available;
    fastfilter1.searchType = FilterDataModelSearchTypesEnum.Equal;
    filterStatist3.filters.push(fastfilter1);

    this.service.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.service.ServiceGetCount(filterStatist3).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          if (ret.totalRowCount > 0) {
            this.modelData.set('Available', ret.totalRowCount);
          }
          else {
            this.modelData.delete('Available');
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(this.constructor.name + 'Available');

      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'Available');
      }
    }
    );
    /** Archive */
    const filterStatist4 = JSON.parse(JSON.stringify(this.filteModelContent));
    fastfilter1 = new FilterDataModel();
    fastfilter1.propertyName = 'RecordStatus';
    fastfilter1.value = RecordStatusEnum.Archive;
    fastfilter1.searchType = FilterDataModelSearchTypesEnum.Equal;
    filterStatist4.filters.push(fastfilter1);
    this.service.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.service.ServiceGetCount(filterStatist4).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          if (ret.totalRowCount > 0) {
            this.modelData.set('Archive', ret.totalRowCount);
          }
          else {
            this.modelData.delete('Archive');
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(this.constructor.name + 'Archive');

      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'Archive');
      }
    }
    );
    /** Disable */
    const filterStatist5 = JSON.parse(JSON.stringify(this.filteModelContent));
    fastfilter1 = new FilterDataModel();
    fastfilter1.propertyName = 'RecordStatus';
    fastfilter1.value = RecordStatusEnum.Disable;
    fastfilter1.searchType = FilterDataModelSearchTypesEnum.Equal;
    filterStatist5.filters.push(fastfilter1);
    this.service.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.service.ServiceGetCount(filterStatist5).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          if (ret.totalRowCount > 0) {
            this.modelData.set('Disable', ret.totalRowCount);
          }
          else {
            this.modelData.delete('Disable');
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(this.constructor.name + 'Disable');

      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'Disable');
      }
    }
    );

  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
