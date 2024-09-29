
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthRenewTokenModel,
  CoreAuthService,
  CoreSiteModel,
  CoreSiteService,
  FilterModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { WidgetContentInfoModel, WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { PersianCalendarService } from 'src/app/core/pipe/persian-date/persian-date.service';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-site-widget-status',
  templateUrl: './widget.component.html',

})
export class CoreSiteWidgetStatusComponent implements OnInit, OnDestroy {
  tokenInfoModel = new TokenInfoModel();
  filteModelContent = new FilterModel();

  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  indexTheme = ['symbol-light-success', 'symbol-light-warning', 'symbol-light-danger', 'symbol-light-info', 'symbol-light-info', 'symbol-light-info'];


  constructorInfoAreaId = this.constructor.name;
  constructor(
    private service: CoreSiteService,
    public translate: TranslateService,
    private persianCalendarService: PersianCalendarService,
    private cmsToastrService: CmsToastrService,
    private coreAuthService: CoreAuthService,
    private tokenHelper: TokenHelper,
  ) { }
  ngOnInit(): void {
    this.widgetInfoModel.title = 'TITLE.ACTIVE.SYSTEM :';
    this.widgetInfoModel.description = 'TITLE.SUMMARY_SYSTEM_DESCRIPTION';
    this.widgetInfoModel.link = '/core/site';

    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfoModel = value;
    });
    setTimeout(() => {
      if (!this.firstLoadDataRunned)
        this.onActionStatist();
    }, 500);

    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfoModel = ret;
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
    if (!this.tokenInfoModel.siteId || this.tokenInfoModel.siteId <= 0) {
      return;
    }
    this.widgetInfoModel.link = '/core/site/edit/' + this.tokenInfoModel.siteId;
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('Id', 0, 0, '', '', this.tokenInfoModel.siteId + ''));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('Title', 1, 0, '', '', '...'));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('Domain', 2, 0, '', '', '...'));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('Sub Domain', 3, 0, '', '', '...'));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('Created Date', 4, 0, '', '', '...'));
    this.widgetInfoModel.setItem(new WidgetContentInfoModel('Expire Date', 5, 0, '', '', '...'));
    this.service.ServiceGetOneById(this.tokenInfoModel.siteId).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.widgetInfoModel.setItem(new WidgetContentInfoModel('Title', 1, 0, '', '', ret.item.title));
          this.widgetInfoModel.setItem(new WidgetContentInfoModel('Domain', 2, 0, '', '', ret.item.domain));
          this.widgetInfoModel.setItem(new WidgetContentInfoModel('Sub Domain', 3, 0, '', '', ret.item.subDomain));
          this.widgetInfoModel.setItem(new WidgetContentInfoModel('Created Date', 4, 0, '', '', this.persianCalendarService.PersianCalendar(ret.item.createdDate)));
          if (ret.item.expireDate) {
            this.widgetInfoModel.setItem(new WidgetContentInfoModel('Expire Date', 5, 0, '', '', this.persianCalendarService.PersianCalendar(ret.item.expireDate)));
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
      },
      error: (er) => {
      }
    }
    );

  }
  onActionSiteSelect(model: CoreSiteModel): void {
    if (model && model.id > 0) {
      // this.inputSiteId = model.id;
      if (model.id !== this.tokenInfoModel.siteId) {
        if (model.id === this.tokenInfoModel.siteId) {
          const etitle = this.translate.instant('TITLE.Warrning');
          const emessage = this.translate.instant('MESSAGE.The_ID_of_this_website_is_the_same_as_the_website_you_are_on');
          this.cmsToastrService.toastr.warning(emessage, etitle);
          return;
        }
        const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
        authModel.userAccessAdminAllowToProfessionalData = this.tokenInfoModel.userAccessAdminAllowToProfessionalData;
        authModel.userAccessAdminAllowToAllData = this.tokenInfoModel.userAccessAdminAllowToAllData;
        authModel.userId = this.tokenInfoModel.userId;
        authModel.siteId = model.id;
        authModel.lang = this.tokenInfoModel.language;

        var title = "";
        var message = "";
        this.translate.get(['TITLE.Information', 'MESSAGE.Request_to_change_site_was_sent_to_the_server']).subscribe((str: string) => {
          title = str['TITLE.Information'];
          message = str['MESSAGE.Request_to_change_site_was_sent_to_the_server'] + '?';
        });

        this.cmsToastrService.toastr.info(message, title);
        this.coreAuthService.ServiceRenewToken(authModel).subscribe({
          next: (ret) => {
            if (ret.isSuccess) {
              if (ret.item.siteId === +model.id) {
                this.cmsToastrService.toastr.success(this.translate.instant('MESSAGE.New_site_acess_confirmed'), title);

              } else {
                this.cmsToastrService.toastr.warning(this.translate.instant('ERRORMESSAGE.MESSAGE.New_site_acess_denied'), title);
              }
            } else {
              this.cmsToastrService.typeErrorAccessChange(ret.errorMessage);
            }

          },
          error: (er) => {
            this.cmsToastrService.typeErrorAccessChange(er);
          }
        }
        );
      }
    }
  }
}
