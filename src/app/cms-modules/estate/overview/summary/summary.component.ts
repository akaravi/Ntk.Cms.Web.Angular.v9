import {
  ChangeDetectorRef, Component,
  OnDestroy, OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  DataFieldInfoModel, ErrorExceptionResult,
  EstatePropertyTypeUsageModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
    selector: 'app-estate-overview-summary',
    templateUrl: './summary.component.html',
    standalone: false
})
export class EstateOverviewSummaryComponent implements OnInit, OnDestroy {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
    public dialog: MatDialog,
    public translate: TranslateService,
    public tokenHelper: TokenHelper
  ) {
    this.publicHelper.processService.cdr = this.cdr;

  }

  dataModelResult: ErrorExceptionResult<EstatePropertyTypeUsageModel> = new ErrorExceptionResult<EstatePropertyTypeUsageModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
      }
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }

}
