import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ApiTelegramConfigurationService, BaseModuleSiteCheckUserModel, CoreEnumService,
  ErrorExceptionResult, TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-apitelegram-config-checkuser',
  templateUrl: './check-user.component.html',
})
export class ApiTelegramConfigCheckUserComponent implements OnInit, OnDestroy {
  requestLinkUserId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private configService: ApiTelegramConfigurationService,
    private activatedRoute: ActivatedRoute,
    private tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

    this.requestLinkUserId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserId'));
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.onLoadDate();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.geTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        this.onLoadDate();
      }
    });
    this.onLoadDate();
  }
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
        error: (err) => {
          this.cmsToastrService.typeErrorGetOne(err);
          this.publicHelper.processService.processStop(pName);
        }
      }
      );
  }
}
