
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  BaseModuleSiteCheckUserModel,
  BiographyConfigurationService,
  CoreEnumService,
  ErrorExceptionResult,
  TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-biography-config-checkuser',
  templateUrl: './check-user.component.html',
})
export class BiographyConfigCheckUserComponent implements OnInit, OnDestroy {
  requestLinkUserId = 0;
  constructor(
    private configService: BiographyConfigurationService,
    private activatedRoute: ActivatedRoute,
    private tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    this.requestLinkUserId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserId'));
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.onLoadDate();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        this.onLoadDate();
      }
    });
    this.onLoadDate();
  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
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
    this.translate.get('TITLE.Check_account').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str); });
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
