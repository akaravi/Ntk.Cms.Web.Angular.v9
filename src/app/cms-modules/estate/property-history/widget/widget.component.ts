
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EstatePropertyHistoryService, FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel, ManageUserAccessDataTypesEnum, RecordStatusEnum } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { WidgetContentInfoModel, WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-property-history-widget',
  templateUrl: './widget.component.html',

})

export class EstatePropertyHistoryWidgetComponent implements OnInit, OnDestroy {


  constructorInfoAreaId = this.constructor.name;
  constructor(
    private service: EstatePropertyHistoryService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    private tokenHelper: TokenHelper,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

  }
  filteModelContent = new FilterModel();

  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;


  ngOnInit() {
    this.widgetInfoModel.title = this.translate.instant('ROUTE.ESTATE.HISTORY');
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/estate/property-history';

    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.onActionStatist();
      }
    });


  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();

  }

  onActionStatist(): void {
    this.publicHelper.processService.processStart(this.constructor.name + 'InChecking');
    this.publicHelper.processService.processStart(this.constructor.name + 'Available');
    this.publicHelper.processService.processStart(this.constructor.name + 'All');

    this.widgetInfoModel.setItem(new WidgetContentInfoModel('InChecking', 0, 0, ''));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('Available', 1, 0, ''));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('All', 2, 0, ''));

    this.service.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.service.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.widgetInfoModel.setItem(new WidgetContentInfoModel('All', 2, ret.totalRowCount, this.widgetInfoModel.link));
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
    let fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'RecordStatus';
    fastfilter.value = RecordStatusEnum.Available;
    filterStatist1.filters.push(fastfilter);
    this.service.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.service.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.widgetInfoModel.setItem(new WidgetContentInfoModel('Available', 1, ret.totalRowCount, this.widgetInfoModel.link));
        }
        this.publicHelper.processService.processStop(this.constructor.name + 'Available');
      },
      error: (er) => {
        this.publicHelper.processService.processStop(this.constructor.name + 'Available');
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
            this.widgetInfoModel.setItem(new WidgetContentInfoModel('InChecking', 0, ret.totalRowCount, '/estate/property-history/InChecking/true'));
          }
          else {

            this.widgetInfoModel.link = '/estate/property-history';
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(this.constructor.name + 'InChecking');
      },
      error: (er) => {
        this.publicHelper.processService.processStop(this.constructor.name + 'InChecking');
      }
    }
    );
  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
