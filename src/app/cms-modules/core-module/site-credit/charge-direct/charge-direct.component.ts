
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleSiteCreditChargeDirectDtoModel, CoreModuleSiteCreditModel, CoreModuleSiteCreditService, CoreSiteService, ErrorExceptionResult } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-coremodule-site-credit-direct-add',
  templateUrl: './charge-direct.component.html',
})
export class CoreModuleSiteCreditChargeDirectComponent implements OnInit {
  requestModel: CoreModuleSiteCreditModel;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(DOCUMENT) private document: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private coreSiteService: CoreSiteService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public publicHelper: PublicHelper,
    private service: CoreModuleSiteCreditService,
    public translate: TranslateService,
    private dialogRef: MatDialogRef<CoreModuleSiteCreditChargeDirectComponent>,

  ) {
    if (data) {
      this.requestModel = data.model || new CoreModuleSiteCreditModel();
    }

  }

  dataModel: CoreModuleSiteCreditChargeDirectDtoModel = new CoreModuleSiteCreditChargeDirectDtoModel();
  dataModelResult: ErrorExceptionResult<CoreModuleSiteCreditModel> = new ErrorExceptionResult<CoreModuleSiteCreditModel>();

  ngOnInit(): void {
    if (!this.requestModel || this.requestModel.linkSiteId <= 0 || this.requestModel.linkModuleId <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.dataModel.credit = this.requestModel.credit;
    this.dataModel.linkModuleId = this.requestModel.linkModuleId;
    this.dataModel.linkSiteId = this.requestModel.linkSiteId;
  }


  onActionButtonAdd(): void {
    const pName = this.constructor.name + 'ServiceChargeDirect';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.service.ServiceChargeDirect(this.dataModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });
        }
        else {
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

  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}

