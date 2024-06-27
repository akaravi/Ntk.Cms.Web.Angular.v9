
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreConfigurationService, ErrorExceptionResult } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-auth-singup-rule',
  templateUrl: './singupRule.Component.html',
})
export class SingupRuleComponent implements OnInit {
  constructor(
    private coreConfigurationService: CoreConfigurationService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    private publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
  }
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<string> = new ErrorExceptionResult<string>();
  ngOnInit(): void {
    const pName = this.constructor.name + 'ServiceUserMembershipRule';
    this.publicHelper.processService.processStart(pName, this.translate.instant('MESSAGE.get_the_rules'));
    this.coreConfigurationService
      .ServiceUserMembershipRule()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            // console.log(ret);
            this.dataModelResult = ret;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetOne(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
  }

}
