import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ErrorExceptionResult, FilterDataModel, FilterModel, NewsCategoryModel, NewsCategoryService, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsImageThumbnailPipe } from 'src/app/core/pipe/cms-image-thumbnail.pipe';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-news-category-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class NewsCategoryMenuComponent implements OnInit {
  requestLinkParentId = 0;
  constructor(
    public tokenHelper: TokenHelper,
    public categoryService: NewsCategoryService,
    private cmsToastrService: CmsToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private publicHelper: PublicHelper,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    this.activatedRoute.params.subscribe((data) => {
      this.requestLinkParentId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkParentId'));
      this.loadData();
    });
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo && this.tokenInfo.userId > 0 && this.tokenInfo.siteId > 0) {
        setTimeout(() => {
          this.loadData();
        }, 100);
      }
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo && this.tokenInfo.userId > 0 && this.tokenInfo.siteId > 0) {
        setTimeout(() => {
          this.loadData();
        }, 100);
      }
    });
  }
  routerLinkContect = '/news/content/';
  routerLinkCategory = '/news/category/';

  loading = new ProgressSpinnerModel();
  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();
  dataModelResult: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();
  dataListResult: NewsCategoryModel[] = [];
  filterModel = new FilterModel();
  cmsImageThumbnailPipe = new CmsImageThumbnailPipe();
  ngOnInit(): void {

  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  loadData() {
    this.DataGetAll();
  }
  DataGetAll(): void {
    this.filterModel.rowPerPage = 200;
    this.filterModel.accessLoad = true;
    if (this.requestLinkParentId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'linkParentId';
      filter.value = this.requestLinkParentId;
      this.filterModel.filters.push(filter);
    }
    const pName = this.constructor.name + '.ServiceGetAll';
    this.translate.get('MESSAGE.get_categories').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str); });
    this.categoryService.ServiceGetAll(this.filterModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.DataListSelect();
        }
        else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.publicHelper.processService.processStop(pName);
        this.cmsToastrService.typeError(er);
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
  onActionClickMenu(item: NewsCategoryModel) {
    if (!item) {
      this.router.navigate([this.routerLinkCategory + '/LinkParentId/', 0]);
      return;
    }
    if (item.children?.length > 0) {
      this.router.navigate([this.routerLinkCategory + '/LinkParentId/', item.id]);
      return;
    }
    this.router.navigate([this.routerLinkContect + '/LinkCategoryId/', item.id]);
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: `smooth` });
  }
}
