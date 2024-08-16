
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CoreUserModel, CoreUserService, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';
import { CoreUserEmailConfirmComponent } from '../emailConfirm/emailConfirm.component';
import { CoreUserMobileConfirmComponent } from '../mobileConfirm/mobileConfirm.component';

@Component({
  selector: 'app-core-user-widget',
  templateUrl: './widget.component.html',
})
export class CoreUserWidgetComponent implements OnInit, OnDestroy {
  tokenInfo = new TokenInfoModel();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;



  constructorInfoAreaId = this.constructor.name;
  constructor(
    private service: CoreUserService,
    private cmsToastrService: CmsToastrService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;


  }
  dataModel: CoreUserModel = new CoreUserModel();
  ngOnInit(): void {
    this.widgetInfoModel.title = 'TITLE.YOU:';
    this.widgetInfoModel.description = 'TITLE.SUMMARY_ACCOUNT_DESCRIPTION';
    this.widgetInfoModel.link = '/core/User';


    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      this.onActionStatist();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        this.onActionStatist();
      }
    });


  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();

  }

  onActionStatist(): void {
    if (!this.tokenInfo.userId || this.tokenInfo.userId <= 0) {
      return;
    }
    this.publicHelper.processService.processStart(this.constructor.name + 'All');
    this.widgetInfoModel.link = '/core/user/edit/' + this.tokenInfo.userId;
    // this.modelData.set('Id', this.tokenInfoModel.userId + '');
    // this.modelData.set('Username', '...');
    // this.modelData.set('Name', '...');
    // this.modelData.set('Last Name', '...');
    // this.modelData.set('Compnay', '...');
    // this.modelData.set('Email', '...');
    // this.modelData.set('Email Confirmed', '...');
    // this.modelData.set('Mobile', '...');
    // this.modelData.set('Mobile Confirmed', '...');

    // this.modelData.set('Created Date', '...');
    // this.modelData.set('Expire Date', '...');
    this.service.ServiceGetOneById(this.tokenInfo.userId).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModel = ret.item;
          //this.modelData.set('Username', ret.item.username);
          //this.modelData.set('Name', ret.item.name);
          // this.modelData.set('Last Name', ret.item.lastName);
          // this.modelData.set('Compnay', ret.item.companyName);
          // this.modelData.set('Email', ret.item.email);
          // this.modelData.set('Email Confirmed', ret.item.emailConfirmed + '');
          // this.modelData.set('Mobile', ret.item.mobile);
          // this.modelData.set('Mobile Confirmed', ret.item.mobileConfirmed + '');

          // this.modelData.set('Created Date', this.persianCalendarService.PersianCalendar(ret.item.createdDate));
          // if (ret.item.expireDate) {
          //   this.modelData.set('Expire Date', this.persianCalendarService.PersianCalendar(ret.item.expireDate));
          // }
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

  }
  onActionButtonEmailConfirm(): void {

    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(CoreUserEmailConfirmComponent, {
      height: '70%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.onActionStatist();
      }
    });
  }
  onActionButtonMobileConfirm(): void {

    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(CoreUserMobileConfirmComponent, {
      height: '70%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.onActionStatist();
      }
    });
  }

}
