
import {
  ChangeDetectorRef, Component, Input, OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreModuleSaleHeaderModel, CoreModuleSaleHeaderService, DataFieldInfoModel, ErrorExceptionResult
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-modulesaleheader-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class CoreModuleSaleHeaderHeaderComponent implements OnInit {
  constructor(
    public coreEnumService: CoreEnumService,
    public coreModuleSaleHeaderService: CoreModuleSaleHeaderService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
  }
  @Input() optionId = 0;

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreModuleSaleHeaderModel> = new ErrorExceptionResult<CoreModuleSaleHeaderModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();





  ngOnInit(): void {
    if (this.optionId > 0) {
      this.DataGetOneContent();
    }

  }

  DataGetOneContent(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.coreModuleSaleHeaderService.setAccessLoad();
    this.coreModuleSaleHeaderService.ServiceGetOneById(this.optionId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelResult = ret;
        } else {
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
}
