
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationAppModel, ApplicationAppService, FormInfoModel } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
})
export class ApplicationAppDownloadComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dataModel: ApplicationAppModel,
    private dialogRef: MatDialogRef<ApplicationAppDownloadComponent>,
    private applicationAppService: ApplicationAppService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    private publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
  }
  formInfo: FormInfoModel = new FormInfoModel();
  loading = new ProgressSpinnerModel();
  // dataModel = new ApplicationAppModel();
  ngOnInit(): void {
    this.DataGetOne(this.dataModel.id);
  }
  DataGetOne(requestId: number): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.get_information_from_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'ServiceGetOneById';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });
    this.applicationAppService
      .ServiceGetOneById(requestId)
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = true;
          if (ret.isSuccess) {
            this.dataModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onActionDownloadApp(): void {
    window.open(this.dataModel.downloadLinkSrc);
  }
  onActionDownloadUpdate(): void {
    window.open(this.dataModel.downloadLinkUpdateSrc);
  }
}
