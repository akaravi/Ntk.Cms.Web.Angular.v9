import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreCpMainMenuModel, CoreCpMainMenuService, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-page-menu',
  templateUrl: './page-menu.component.html',
  styleUrls: ['./page-menu.component.scss']
})
export class PageMenuComponent implements OnInit {
  requestLinkParentId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public tokenHelper: TokenHelper,
    private coreCpMainMenuService: CoreCpMainMenuService,
    private cmsToastrService: CmsToastrService,
    private cmsStoreService: CmsStoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    public publicHelper: PublicHelper,
  ) {
    this.activatedRoute.params.subscribe((data) => {
      this.requestLinkParentId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkParentId'));
      this.loadData();
    });
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      if (!this.dataModelResult || !this.dataModelResult.listItems || this.dataModelResult.listItems.length === 0)
        this.loadData();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe((value) => {
      this.tokenInfo = value;
      this.loadData();
    });
  }

  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();
  dataModelResult: ErrorExceptionResult<CoreCpMainMenuModel> = new ErrorExceptionResult<CoreCpMainMenuModel>();
  dataListResult: CoreCpMainMenuModel[] = [];
  dataPinListResult: CoreCpMainMenuModel[] = [];
  ngOnInit(): void {

  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  loadData() {
    if (this.tokenInfo && this.tokenInfo.userId > 0 && this.tokenInfo.siteId > 0) {
      setTimeout(() => {
        const storeSnapshot = this.cmsStoreService.getStateSnapshot();
        if (storeSnapshot?.coreCpMainResultStore?.isSuccess && storeSnapshot?.coreCpMainResultStore?.listItems?.length > 0) {
          this.dataModelResult = storeSnapshot.coreCpMainResultStore;
          this.DataListSelect();
        } else {
          this.DataGetCpMenu();
        }
      }, 100);
    }
  }
  DataPinListSelect() {
    debugger
    this.dataPinListResult = [];
    if (this.publicHelper.themeService?.ThemeMenuPin?.length > 0) {
      this.dataModelResult.listItems.forEach((row) => {
        var id = row.id + "";
        if (this.publicHelper.themeService?.ThemeMenuPin[id] === true)
          this.dataPinListResult.push(row);
      });
    }
  }
  DataGetCpMenu(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.get_information_list').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    this.coreCpMainMenuService.ServiceGetAllMenu(null).subscribe({
      next: (ret) => {

        if (ret.isSuccess) {
          this.dataModelResult = ret;
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.DataListSelect();
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }
  DataListSelect() {
    this.DataPinListSelect();
    this.dataListResult = [];
    if (!this.requestLinkParentId || this.requestLinkParentId === 0) {
      this.dataListResult = this.dataModelResult.listItems;
      return;
    }
    var findRow = this.dataModelResult.listItems.filter(x => x.id === this.requestLinkParentId);
    if (findRow && findRow.length > 0 && findRow[0].children && findRow[0].children.length > 0)
      this.dataListResult = findRow[0].children;
  }
  onActionClickMenu(item: CoreCpMainMenuModel, event?: MouseEvent) {
    if (!item)
      return;
    const pName = this.constructor.name + "menu";
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    if (item.children?.length > 0) {
      if (event?.ctrlKey) {
        window.open('/#/menu/LinkParentId/' + item.id, "_blank");
      } else {
        this.router.navigate(['/menu/LinkParentId/', item.id]);
      }
      this.publicHelper.processService.processStop(pName);
      return;
    }
    if (item.routeAddressLink?.length > 0) {
      if (event?.ctrlKey) {
        window.open('/#' + item.routeAddressLink, "_blank");
      } else {
        this.router.navigate([item.routeAddressLink]);
      }
      this.publicHelper.processService.processStop(pName);
      return;
    }
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: `smooth` });
  }
}
