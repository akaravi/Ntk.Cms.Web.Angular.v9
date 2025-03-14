
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ArticleConfigurationService, BaseModuleSiteCheckUserModel, CoreEnumService,
  ErrorExceptionResult,
  TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
    selector: 'app-core-config-checkuser',
    templateUrl: './check-user.component.html',
    standalone: false
})
export class ArticleConfigCheckUserComponent implements OnInit, OnDestroy {
  requestLinkUserId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private configService: ArticleConfigurationService,
    private activatedRoute: ActivatedRoute,
    private tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

    this.requestLinkUserId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserId'));
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      setTimeout(() => {
        if (!this.firstLoadDataRunned)
          this.onLoadDate();
      }, 500);
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        this.firstLoadDataRunned = true;
        this.onLoadDate();
      }
    });
  }
  firstLoadDataRunned = false;

  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();

  dataModelResult: ErrorExceptionResult<BaseModuleSiteCheckUserModel> = new ErrorExceptionResult<BaseModuleSiteCheckUserModel>();
  tableRowsSelected: Array<BaseModuleSiteCheckUserModel> = [];
  tableRowSelected: BaseModuleSiteCheckUserModel = new BaseModuleSiteCheckUserModel();
  tableSource: MatTableDataSource<BaseModuleSiteCheckUserModel> = new MatTableDataSource<BaseModuleSiteCheckUserModel>();
  tabledisplayedColumns: string[] = [
    'Accepted',
    'Title',
    'Description'
  ];
  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onLoadDate(): void {
    if (!this.requestLinkUserId || this.requestLinkUserId === 0) {
      this.requestLinkUserId = this.tokenInfo.userId;
    }
    if (!this.requestLinkUserId || this.requestLinkUserId === 0) {
      return;
    }
    const pName = this.constructor.name + '.ServiceCheckUser';
    this.translate.get('TITLE.Check_account').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    this.configService
      .ServiceCheckUser(this.requestLinkUserId)
      .subscribe({
        next: (ret) => {
          this.publicHelper.processService.processStop(pName);
          this.dataModelResult = ret;
          this.tableSource.data = ret.listItems;
          if (!ret.isSuccess) {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetOne(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
  }
}
