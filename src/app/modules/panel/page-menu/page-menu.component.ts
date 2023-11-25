import { I } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreCpMainMenuModel, CoreCpMainMenuService, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-page-menu',
  templateUrl: './page-menu.component.html',
  styleUrls: ['./page-menu.component.scss']
})
export class PageMenuComponent implements OnInit {
  requestLinkParentId = 0;
  constructor(
    public tokenHelper: TokenHelper,
    private coreCpMainMenuService: CoreCpMainMenuService,
    private cmsToastrService: CmsToastrService,
    private cmsStoreService: CmsStoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
  ) {
    this.activatedRoute.params.subscribe((data) => {
      this.requestLinkParentId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkParentId'));
      this.loadData();
    });
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      if (!this.dataModelResult || !this.dataModelResult.listItems || this.dataModelResult.listItems.length === 0)
        this.loadData();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;
      this.loadData();
    });
  }
  loading = new ProgressSpinnerModel();
  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();
  dataModelResult: ErrorExceptionResult<CoreCpMainMenuModel> = new ErrorExceptionResult<CoreCpMainMenuModel>();
  dataListResult: CoreCpMainMenuModel[] = [];
  ngOnInit(): void {

  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  loadData() {
    if (this.tokenInfo && this.tokenInfo.userId > 0 && this.tokenInfo.siteId > 0) {
      setTimeout(() => {
        const storeSnapshot = this.cmsStoreService.getStateSnapshot();
        if (storeSnapshot?.CoreCpMainResultStore?.isSuccess && storeSnapshot?.CoreCpMainResultStore?.listItems?.length > 0) {
          this.dataModelResult = storeSnapshot.CoreCpMainResultStore;
          this.DataListSelect();
        } else {
          this.DataGetCpMenu();
        }
      }, 100);
    }
  }
  DataGetCpMenu(): void {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.coreCpMainMenuService.ServiceGetAllMenu(null).subscribe({
      next: (ret) => {

        if (ret.isSuccess) {
          this.dataModelResult = ret;
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.DataListSelect();
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }
  DataListSelect() {
    this.dataListResult = [];
    if (!this.requestLinkParentId || this.requestLinkParentId === 0) {
      this.dataListResult = this.dataModelResult.listItems;
      return;
    }
    var findRow = this.dataModelResult.listItems.filter(x => x.id === this.requestLinkParentId);
    if (findRow && findRow.length > 0 && findRow[0].children && findRow[0].children.length > 0)
      this.dataListResult = findRow[0].children;
  }
  onActionClickMenu(item: CoreCpMainMenuModel) {
    if (!item)
      return;
    if (item.children?.length > 0) {
      this.router.navigate(['/menu/LinkParentId/', item.id]);
      return;
    }
    if (item.routeAddressLink?.length > 0) {
      this.router.navigate([item.routeAddressLink]);
      return;
    }
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: `smooth` });
  }
}
