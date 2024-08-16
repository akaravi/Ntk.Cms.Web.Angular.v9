import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthRenewTokenModel, CoreAuthService, CoreSiteModel, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-menu-profile',
  templateUrl: './menu-profile.component.html',
})
export class MenuProfileComponent implements OnInit {
  static nextId = 0;
  id = ++MenuProfileComponent.nextId;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
    public publicHelper: PublicHelper,
    private router: Router
  ) {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.geTokenInfoStateOnChange().subscribe((value) => {
      this.tokenInfo = value;
    });

  }


  cmsApiStoreSubscribe: Subscription;
  tokenInfo: TokenInfoModel = new TokenInfoModel();
  inputSiteId?: number;
  inputUserId?: number;
  loadingStatus = false;
  disabledAllow = false;
  themeStore = new ThemeStoreModel();
  ngOnInit(): void {

    this.publicHelper.getStateOnChange().subscribe((value) => {
      this.themeStore = value.themeStore;
    });

  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionButtonUserAccessAdminAllowToAllData(): void {
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    const NewToall = !this.tokenInfo.userAccessAdminAllowToAllData;
    authModel.userAccessAdminAllowToProfessionalData = this.tokenInfo.userAccessAdminAllowToProfessionalData;
    authModel.userAccessAdminAllowToAllData = NewToall;
    authModel.siteId = this.tokenInfo.siteId;
    authModel.userId = this.tokenInfo.userId;
    authModel.lang = this.tokenInfo.language;

    const title = this.translate.instant('TITLE.Information');
    let message = '';
    if (authModel.userAccessAdminAllowToAllData) {
      message = this.translate.instant('MESSAGE.Request_to_access_all_information_has_been_sent_to_the_server');
    } else {
      message = this.translate.instant('MESSAGE.Request_to_terminate_access_to_all_information_has been_sent_to_the_server');
    }
    if (this.cmsToastrService) this.cmsToastrService.toastr.info(message, title);
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.loadingStatus = true;
    this.disabledAllow = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe({
      next: (ret) => {
        this.loadingStatus = false;
        this.disabledAllow = false;
        if (ret.isSuccess) {
          const etitle = this.translate.instant('TITLE.Information');
          let emessage = '';
          if (ret.item.userAccessAdminAllowToAllData === NewToall) {
            emessage = this.translate.instant('MESSAGE.Access_is_approved');
            if (this.cmsToastrService) this.cmsToastrService.toastr.success(emessage, etitle);
          } else {
            emessage = this.translate.instant('MESSAGE.New_access_not_approved');
            if (this.cmsToastrService) this.cmsToastrService.toastr.warning(emessage, etitle);
          }
        } else {
          if (this.cmsToastrService) this.cmsToastrService.typeErrorAccessChange(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.loadingStatus = false;
        this.disabledAllow = false;
        if (this.cmsToastrService) this.cmsToastrService.typeErrorAccessChange(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }

  onActionButtonUserAccessAdminAllowToProfessionalData(): void {
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    const NewToPerf = !this.tokenInfo.userAccessAdminAllowToProfessionalData;
    authModel.userAccessAdminAllowToProfessionalData = NewToPerf;
    authModel.userAccessAdminAllowToAllData = this.tokenInfo.userAccessAdminAllowToAllData;
    authModel.siteId = this.tokenInfo.siteId;
    authModel.userId = this.tokenInfo.userId;
    authModel.lang = this.tokenInfo.language;

    const title = this.translate.instant('TITLE.Information');
    let message = '';
    if (authModel.userAccessAdminAllowToProfessionalData) {
      message = this.translate.instant('MESSAGE.Request_for_professional_access_to_the_server_has_been_sent');
    } else {
      message = this.translate.instant('MESSAGE.Request_to_terminate_professional_access_has_been_sent_to_the_server');
    }
    if (this.cmsToastrService) this.cmsToastrService.toastr.info(message, title);
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.loadingStatus = true;
    this.disabledAllow = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe({
      next: (ret) => {
        this.loadingStatus = false;
        this.disabledAllow = false;
        if (ret.isSuccess) {
          const etitle = this.translate.instant('TITLE.Information');
          if (ret.item.userAccessAdminAllowToProfessionalData === NewToPerf) {
            const emessage = this.translate.instant('MESSAGE.Access_is_approved');
            if (this.cmsToastrService) this.cmsToastrService.toastr.success(emessage, etitle);
          } else {
            const emessage = this.translate.instant('MESSAGE.New_access_not_approved');
            if (this.cmsToastrService) this.cmsToastrService.toastr.warning(emessage, etitle);
          }
        } else {
          if (this.cmsToastrService) this.cmsToastrService.typeErrorAccessChange(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.loadingStatus = false;
        this.disabledAllow = false;
        if (this.cmsToastrService) this.cmsToastrService.typeErrorAccessChange(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }

  onActionButtonSelectUser(): void {
    if (this.inputUserId === this.tokenInfo.userId) {
      const etitle = this.translate.instant('TITLE.Warrning');
      const emessage = this.translate.instant('MESSAGE.The_ID_of_this_website_is_the_same_as_the_website_you_are_on');
      if (this.cmsToastrService) this.cmsToastrService.toastr.warning(emessage, etitle);
      return;
    }
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    authModel.userAccessAdminAllowToProfessionalData = this.tokenInfo.userAccessAdminAllowToProfessionalData;
    authModel.userAccessAdminAllowToAllData = this.tokenInfo.userAccessAdminAllowToAllData;
    authModel.siteId = this.tokenInfo.siteId;
    authModel.userId = this.inputUserId;
    authModel.lang = this.tokenInfo.language;


    var title = "";
    var message = "";
    this.translate.get(['TITLE.Information', 'MESSAGE.Request_to_change_site_was_sent_to_the_server']).subscribe((str: string) => {
      title = str['TITLE.Information'];
      message = str['MESSAGE.Request_to_change_site_was_sent_to_the_server'] + '?';
    });

    if (this.cmsToastrService) this.cmsToastrService.toastr.info(message, title);
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      {
        next: (ret) => {
          this.loadingStatus = false;
          if (ret.isSuccess) {
            if (ret.item.userId === +this.inputUserId) {

              if (this.cmsToastrService) this.cmsToastrService.toastr.success(this.translate.instant('MESSAGE.Access_to_the_new_user_has_been_approved'), title);
              this.inputSiteId = null;
              this.inputUserId = null;
            } else {
              if (this.cmsToastrService) this.cmsToastrService.toastr.warning(this.translate.instant('MESSAGE.Access_to_the_new_user_was_not_approved'), title);
            }
          } else {
            if (this.cmsToastrService) this.cmsToastrService.typeErrorAccessChange(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (err) => {
          this.loadingStatus = false;
          if (this.cmsToastrService) this.cmsToastrService.typeErrorAccessChange(err);
          this.publicHelper.processService.processStop(pName);
        }
      }
    );
  }

  onActionButtonSelectSite(): void {
    if (this.inputSiteId === this.tokenInfo.siteId) {
      const etitle = this.translate.instant('TITLE.Warrning');
      const emessage = this.translate.instant('MESSAGE.The_ID_of_this_website_is_the_same_as_the_website_you_are_on');
      if (this.cmsToastrService) this.cmsToastrService.toastr.warning(emessage, etitle);
      return;
    }
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    authModel.userAccessAdminAllowToProfessionalData = this.tokenInfo.userAccessAdminAllowToProfessionalData;
    authModel.userAccessAdminAllowToAllData = this.tokenInfo.userAccessAdminAllowToAllData;
    authModel.userId = this.tokenInfo.userId;
    authModel.siteId = this.inputSiteId;
    authModel.lang = this.tokenInfo.language;


    var title = "";
    var message = "";
    this.translate.get(['TITLE.Information', 'MESSAGE.Request_to_change_site_was_sent_to_the_server']).subscribe((str: string) => {
      title = str['TITLE.Information'];
      message = str['MESSAGE.Request_to_change_site_was_sent_to_the_server'] + '?';
    });

    if (this.cmsToastrService) this.cmsToastrService.toastr.info(message, title);
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe({
      next: (ret) => {
        this.loadingStatus = false;
        if (ret.isSuccess) {
          if (ret.item.siteId === +this.inputSiteId) {
            if (this.cmsToastrService) this.cmsToastrService.toastr.success(this.translate.instant('MESSAGE.New_site_acess_confirmed'), title);
            this.inputSiteId = null;
            this.inputUserId = null;
          } else {
            if (this.cmsToastrService) this.cmsToastrService.toastr.warning(this.translate.instant('ERRORMESSAGE.MESSAGE.New_site_acess_denied'), title);
          }
        } else {
          this.inputSiteId = this.tokenInfo.siteId;
          if (this.cmsToastrService) this.cmsToastrService.typeErrorAccessChange(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (err) => {
        this.loadingStatus = false;
        if (this.cmsToastrService) this.cmsToastrService.typeErrorAccessChange(err);
      }
    }
    );
  }
  onActionSiteSelect(model: CoreSiteModel): void {
    if (model && model.id > 0) {
      if (model.id !== this.tokenInfo.siteId) {
        this.inputSiteId = model.id;
        this.onActionButtonSelectSite();
      }
    }
  }
  async onActionLogout() {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Sign_out_of_user_account').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.cmsToastrService.typeOrderActionLogout();

    this.coreAuthService.ServiceLogout().subscribe({
      next: (ret) => {
        this.loadingStatus = false;
        if (ret.isSuccess) {
          this.cmsToastrService.typeSuccessLogout();
          document.location.reload();
        } else {
          this.cmsToastrService.typeErrorLogout();
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (err) => {
        this.loadingStatus = false;
        if (this.cmsToastrService) this.cmsToastrService.typeErrorAccessChange(err);
        this.publicHelper.processService.processStop(pName);
      }
    }
    );

  }

}
