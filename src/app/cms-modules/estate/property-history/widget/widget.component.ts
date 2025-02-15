
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActivityStatusEnumEstate, EstatePropertyHistoryFilterModel, EstatePropertyHistoryService, FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel, ManageUserAccessDataTypesEnum, RecordStatusEnum, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { WidgetContentInfoModel, WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-estate-property-history-widget',
    templateUrl: './widget.component.html',
    standalone: false
})

export class EstatePropertyHistoryWidgetComponent implements OnInit, OnDestroy {


  constructorInfoAreaId = this.constructor.name;
  constructor(
    private service: EstatePropertyHistoryService,
    private cmsToastrService: CmsToastrService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public publicHelper: PublicHelper,
    private tokenHelper: TokenHelper,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

  }
  filteModelContent = new FilterModel();

  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();
  firstLoadDataRunned = false;
  ngOnInit() {
    this.widgetInfoModel.title = this.translate.instant('ROUTE.ESTATE.HISTORY');
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/estate/property-history';

    setTimeout(() => {
      if (!this.firstLoadDataRunned)
        this.onActionStatist();
    }, 1000);

    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        this.firstLoadDataRunned = true;
        this.onActionStatist();
      }
    });
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
    });

  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();

  }
  onActionButtonReload(): void {
    this.onActionStatist();
  }
  onActionStatist(): void {

    this.publicHelper.processService.processStart(this.constructor.name + 'InChecking');
    this.publicHelper.processService.processStart(this.constructor.name + 'Available');
    this.publicHelper.processService.processStart(this.constructor.name + 'All');
    this.publicHelper.processService.processStart(this.constructor.name + 'Planned');
    this.publicHelper.processService.processStart(this.constructor.name + 'PlannedToDay');


    this.widgetInfoModel.setItem(new WidgetContentInfoModel('InChecking', 0, 0, ''));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('Available', 1, 0, ''));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('All', 2, 0, ''));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('Planned', 3, 0, ''));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('PlannedToDay', 4, 0, ''));

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
    /** */
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
    /** */
    let filterStatist3 = new EstatePropertyHistoryFilterModel();
    filterStatist3 = JSON.parse(JSON.stringify(this.filteModelContent));
    fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'activityStatus';
    fastfilter.value = ActivityStatusEnumEstate.Planned;
    fastfilter.searchType = FilterDataModelSearchTypesEnum.Equal;
    /** Search On Select Day */


    filterStatist3.filters.push(fastfilter);
    this.service.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.service.ServiceGetCount(filterStatist3).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          if (ret.totalRowCount > 0) {
            this.widgetInfoModel.setItem(new WidgetContentInfoModel('Planned', 3, ret.totalRowCount, '/estate/property-history/activitystatus/0'));
          }
          else {
            this.widgetInfoModel.link = '/estate/property-history';
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(this.constructor.name + 'Planned');
      },
      error: (er) => {
        this.publicHelper.processService.processStop(this.constructor.name + 'Planned');
      }
    }
    );
    /** */
    /** */
    let filterStatist4 = new EstatePropertyHistoryFilterModel();
    filterStatist4 = JSON.parse(JSON.stringify(this.filteModelContent));
    const hours = 48;
    filterStatist4.onDateTimeFrom = new Date(new Date().setHours(0, 0, 0, 0) - (hours * 60 * 60 * 1000));
    filterStatist4.onDateTimeTo = new Date(new Date().setHours(23, 59, 59, 999));
    filterStatist4.linkResponsibleUserId = this.tokenInfo.userId;
    fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'activityStatus';
    fastfilter.value = ActivityStatusEnumEstate.Planned;
    fastfilter.searchType = FilterDataModelSearchTypesEnum.Equal;
    /** Search On Select Day */
    filterStatist4.filters.push(fastfilter);
    this.service.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.service.ServiceGetCount(filterStatist4).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          if (ret.totalRowCount > 0) {
            this.widgetInfoModel.setItem(new WidgetContentInfoModel('PlannedToDay', 5, ret.totalRowCount, '/estate/property-history/InCheckingPlanedToDay/' + this.tokenInfo.userId));
            this.cmsToastrService.typeWarningMessage("تعداد " + ret.totalRowCount + " عدد فعالیت برای امروز شما می باشد", " فعالیت برنامه ریزی شده برای شما");
            setTimeout(() =>
              this.confirmDialogPlanned(ret.totalRowCount)
              , 30 * 1000);

          }
          else {
            this.widgetInfoModel.link = '/estate/property-history';
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(this.constructor.name + 'PlannedToDay');
      },
      error: (er) => {
        this.publicHelper.processService.processStop(this.constructor.name + 'PlannedToDay');
      }
    }
    );
    /** */
  }
  confirmDialogPlanned(count: number) {
    var title = "";
    var message = "";
    this.translate.get(['MESSAGE.Please_Confirm', 'MESSAGE.Do_you_want_to_View']).subscribe((str: string) => {
      title = str['MESSAGE.Please_Confirm'];
      message = str['MESSAGE.Do_you_want_to_View'] + '?' + '<br> ( ' + "تعداد " + count + " عدد فعالیت برای امروز شما می باشد" + ' ) ';
    });
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          this.router.navigate(['/estate/property-history/InCheckingPlanedToDay/' + this.tokenInfo.userId]);
        }
      }
      )
      .catch(() => {
        if (environment.consoleLog)
          console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
      }
      );
  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
