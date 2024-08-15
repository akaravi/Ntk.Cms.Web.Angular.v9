import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataFieldInfoModel, ErrorExceptionResult, ManageUserAccessDataTypesEnum, TokenInfoModel, WebDesignerMainPageModel, WebDesignerMainPageService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { HtmlBuilderModel } from 'src/app/core/models/htmlBuilderModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-web-designer-builder',
  //template: '<router-outlet></router-outlet>',
  templateUrl: './web-designer-builder.component.html',
  styleUrls: ['./web-designer-builder.component.scss'],
})
export class WebDesignerBuilderComponent implements OnInit, OnDestroy {
  requestId = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    public webDesignerMainPageService: WebDesignerMainPageService,

  ) {
    this.publicHelper.processService.cdr = this.cdr;
  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();

  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModel: HtmlBuilderModel = new HtmlBuilderModel();
  dataPageModel: WebDesignerMainPageModel = new WebDesignerMainPageModel();
  dataModelResult: ErrorExceptionResult<WebDesignerMainPageModel> = new ErrorExceptionResult<WebDesignerMainPageModel>();

  ngOnInit(): void {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetOneContent();
      this.tokenHelper.CheckIsAdmin();
    });


    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        this.DataGetOneContent();
        this.tokenHelper.CheckIsAdmin();
      }
    });
  }

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetOneContent(): void {
    const pName = this.constructor.name + 'webDesignerMainPageService.ServiceGetOneById';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.webDesignerMainPageService.setAccessLoad();
    this.webDesignerMainPageService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.webDesignerMainPageService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        this.dataPageModel = ret.item;
        if (ret.isSuccess) {

        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);

      },
      error: (err) => {
        this.cmsToastrService.typeError(err);
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }
  // DataEditContent(): void {
  //   const pName = this.constructor.name + 'main';
  //   this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => {this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);});
  //   this.webDesignerMainPageService.ServiceEdit(this.dataModel).subscribe(
  //     next:(ret) => {

  //       this.dataModelResult = ret;
  //       if (ret.isSuccess) {
  //         this.cmsToastrService.typeSuccessEdit();
  //       } else {
  //         this.cmsToastrService.typeErrorMessage(ret.errorMessage);
  //       }
  //       this.publicHelper.processService.processStop(pName);
  //     },
  //     error:(err) => {

  //       this.cmsToastrService.typeError(err);
  //       this.publicHelper.processService.processStop(pName);
  //     }
  //   );
  // }
  onActionAdd() {

  }


}
