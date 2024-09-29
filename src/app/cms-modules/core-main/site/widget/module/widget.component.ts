
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreModuleSiteService, FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel, RecordStatusEnum
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { WidgetContentInfoModel, WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-site-widget-module',
  templateUrl: './widget.component.html',

})
export class CoreSiteWidgetModuleComponent implements OnInit, OnDestroy {
  filteModelContent = new FilterModel();

  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  indexTheme = ['symbol-light-success', 'symbol-light-warning', 'symbol-light-danger', 'symbol-light-info'];



  constructorInfoAreaId = this.constructor.name;
  constructor(
    private service: CoreModuleSiteService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

  }
  ngOnInit(): void {
    this.widgetInfoModel.title = this.translate.instant('TITLE.Registered_modules');
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/core/site/modulelist';

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
    this.publicHelper.processService.processStart(this.constructor.name + 'Active');
    this.publicHelper.processService.processStart(this.constructor.name + 'All');
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

      },
      error: (er) => {
        this.publicHelper.processService.processStop(this.constructor.name + 'Active');
      }
    }
    );


    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastFilter2 = new FilterDataModel();
    fastFilter2.propertyName = 'ExpireDate';
    fastFilter2.value = new Date();
    fastFilter2.searchType = FilterDataModelSearchTypesEnum.GreaterThan;
    filterStatist2.filters.push(fastFilter2);
  }
}
