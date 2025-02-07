
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreConfigurationService, ErrorExceptionResult } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
    selector: 'app-auth-singup-rule',
    templateUrl: './singupRule.Component.html',
    standalone: false
})
export class SingupRuleComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private coreConfigurationService: CoreConfigurationService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

  }

  dataModelResult: ErrorExceptionResult<string> = new ErrorExceptionResult<string>();
  ngOnInit(): void {
    const pName = this.constructor.name + 'ServiceUserMembershipRule';
    this.translate.get('MESSAGE.get_the_rules').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
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
