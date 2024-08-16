
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreSiteService, ErrorExceptionResult, ShareInfoModel, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CmsLinkToComponent } from 'src/app/shared/cms-link-to/cms-link-to.component';

@Component({
  selector: 'app-core-info',
  templateUrl: './core-info.component.html'
})
export class CoreInfoComponent implements OnInit, OnDestroy {

  constructorInfoAreaId = this.constructor.name;
  constructor(
    private tokenHelper: TokenHelper,
    private cmsToastrService: CmsToastrService,
    private coreSiteService: CoreSiteService,
    private router: Router,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public dialog: MatDialog

  ) {
    this.publicHelper.processService.cdr = this.cdr;

    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.geTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        this.DataGetInfo();
      }
    });
    this.DataGetInfo();
  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo: TokenInfoModel;


  dataModelResult: ErrorExceptionResult<ShareInfoModel> = new ErrorExceptionResult<ShareInfoModel>();

  ngOnInit(): void {
    /** read storage */
    const siteId = + localStorage.getItem('siteId');
    if (siteId > 0) {
      //  this.dataModel.siteId = siteId;
    }
    const ResellerSiteId = + localStorage.getItem('ResellerSiteId');
    if (ResellerSiteId > 0) {
      //  this.dataModel.resellerSiteId = ResellerSiteId;
    }
    const ResellerUserId = + localStorage.getItem('ResellerUserId');
    if (ResellerUserId > 0) {
      //  this.dataModel.resellerUserId = ResellerUserId;
    }
    /** read storage */
  }
  DataGetInfo(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.coreSiteService.ServiceGetShareInfo().subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }
  onActionButtonResllerUser(): void {

    this.router.navigate(['/core/user/reseller-chart']);

  }
  onActionButtonResllerUserShortLinkStatus(): void {
    if (this.dataModelResult?.item?.urlResellerUserShortLinkUrl?.length > 0) {

      const indexLast = this.dataModelResult.item.urlResellerUserShortLinkUrl.lastIndexOf('/');
      if (indexLast > 0) {
        const key = this.dataModelResult.item.urlResellerUserShortLinkUrl.substr(indexLast + 1);
        // const url = this.router.serializeUrl(
        //   this.router.createUrlTree([encodeURI('#/linkmanagement/target-billboard-log/Key/' + key)])
        // );
        // window.open(url, '_blank');
        this.router.navigate(['/linkmanagement/target-billboard-log/Key/' + key]);
      }
    }
  }
  onActionButtonResllerUserCategoryShortLinkStatus(): void {
    if (this.dataModelResult?.item?.urlResellerSiteCategoryShortLinkUrl?.length > 0) {
      const indexLast = this.dataModelResult.item.urlResellerSiteCategoryShortLinkUrl.lastIndexOf('/');
      if (indexLast > 0) {
        const key = this.dataModelResult.item.urlResellerSiteCategoryShortLinkUrl.substr(indexLast + 1);
        // const url = this.router.serializeUrl(
        //   this.router.createUrlTree([encodeURI('#/linkmanagement/target-billboard-log/Key/' + key)])
        // );
        // window.open(url, '_blank');
        this.router.navigate(['/linkmanagement/target-billboard-log/Key/' + key]);
      }
    }
  }
  onActionButtonResllerSite(): void {


    this.router.navigate(['/core/site/reseller-chart']);

  }
  onActionButtonResllerSiteShortLinkStatus(): void {
    if (this.dataModelResult?.item?.urlResellerSiteShortLinkUrl?.length > 0) {
      const indexLast = this.dataModelResult.item.urlResellerSiteShortLinkUrl.lastIndexOf('/');
      if (indexLast > 0) {
        const key = this.dataModelResult.item.urlResellerSiteShortLinkUrl.substr(indexLast + 1);

        // const url = this.router.serializeUrl(
        //   this.router.createUrlTree([encodeURI('#/linkmanagement/target-billboard-log/Key/' + key)])
        // );
        // window.open(url, '_blank');
        this.router.navigate(['/linkmanagement/target-billboard-log/Key/' + key]);
      }
    }
  }
  onActionButtonlinkToSiteHome(): void {
    //open popup
    const dialogRef = this.dialog.open(CmsLinkToComponent, {
      // height: "90%",
      data: {
        title: 'TITLE.website_address',
        urlViewContentQRCodeBase64: this.dataModelResult.item.urlSiteHomeShortLinkQRCodeBase64,
        urlViewContent: this.dataModelResult.item.urlSiteHome,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
  onActionButtonlinkToSiteCPanel(): void {
    //open popup
    const dialogRef = this.dialog.open(CmsLinkToComponent, {
      // height: "90%",
      data: {
        title: 'TITLE.The_address_of_the_content_management_system',
        urlViewContentQRCodeBase64: this.dataModelResult.item.urlSiteCPanelShortLinkQRCodeBase64,
        urlViewContent: this.dataModelResult.item.urlSiteCPanel,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
  onActionButtonResllerSiteShortLinkTo(): void {
    //open popup
    const dialogRef = this.dialog.open(CmsLinkToComponent, {
      // height: "90%",
      data: {
        title: 'TITLE.Website_sharing_address',
        urlViewContentQRCodeBase64: this.dataModelResult.item.urlSiteCPanelShortLinkQRCodeBase64,
        urlViewContent: this.dataModelResult.item.urlSiteCPanel,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
  onActionButtonResllerUserShortLinkTo(): void {
    //open popup
    const dialogRef = this.dialog.open(CmsLinkToComponent, {
      // height: "90%",
      data: {
        title: 'TITLE.Sharing_address_with_your_user_account',
        urlViewContentQRCodeBase64: this.dataModelResult.item.urlResellerUserShortLinkQRCodeBase64,
        urlViewContent: this.dataModelResult.item.urlResellerUserShortLinkUrl,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
  onActionButtonResllerUserCategoryShortLinklinkTo(): void {
    //open popup
    const dialogRef = this.dialog.open(CmsLinkToComponent, {
      // height: "90%",
      data: {
        title: 'TITLE.Sharing_address_with_your_user_account',
        urlViewContentQRCodeBase64: this.dataModelResult.item.urlResellerSiteCategoryShortLinkQRCodeBase64,
        urlViewContent: this.dataModelResult.item.urlResellerSiteCategoryShortLinkUrl,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
}
