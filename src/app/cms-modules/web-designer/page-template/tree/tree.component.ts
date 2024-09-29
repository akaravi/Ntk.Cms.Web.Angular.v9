import { NestedTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatTreeNestedDataSource
} from '@angular/material/tree';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterModel,
  WebDesignerMainPageTemplateModel,
  WebDesignerMainPageTemplateService
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';
import { WebDesignerMainPageTemplateAddComponent } from '../add/add.component';
import { WebDesignerMainPageTemplateEditComponent } from '../edit/edit.component';
@Component({
  selector: 'app-webdesigner-pagetemplate-tree',
  templateUrl: './tree.component.html',
})
export class WebDesignerMainPageTemplateTreeComponent implements OnInit, OnDestroy {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: WebDesignerMainPageTemplateService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    private tokenHelper: TokenHelper,
    private translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
  }
  @Input() set optionSelectForce(x: number | WebDesignerMainPageTemplateModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: WebDesignerMainPageTemplateModel = new WebDesignerMainPageTemplateModel();
  dataModelResult: ErrorExceptionResult<WebDesignerMainPageTemplateModel> = new ErrorExceptionResult<WebDesignerMainPageTemplateModel>();
  filterModel = new FilterModel();


  treeControl = new NestedTreeControl<WebDesignerMainPageTemplateModel>(node => null);
  dataSource = new MatTreeNestedDataSource<WebDesignerMainPageTemplateModel>();
  @Output() optionChange = new EventEmitter<WebDesignerMainPageTemplateModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionButtonReload();
  hasChild = (_: number, node: WebDesignerMainPageTemplateModel) => false;
  firstLoadDataRunned = false;
  ngOnInit(): void {
    setTimeout(() => {
      if (!this.firstLoadDataRunned)
        this.DataGetAll();
    }, 500);
    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe((value) => {
      this.DataGetAll();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.filterModel.rowPerPage = 200;
    this.filterModel.accessLoad = true;
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.categoryService.ServiceGetAll(this.filterModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.dataSource.data = this.dataModelResult.listItems;
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
  onActionSelect(model: WebDesignerMainPageTemplateModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionButtonReload(): void {
    this.onActionSelect(null);
    this.dataModelSelect = new WebDesignerMainPageTemplateModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | WebDesignerMainPageTemplateModel): void {
  }
  onActionAdd(): void {
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(WebDesignerMainPageTemplateAddComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionEdit(): void {
    let id = '';
    if (this.dataModelSelect && this.dataModelSelect.id?.length > 0) {
      id = this.dataModelSelect.id;
    }
    if (id.length === 0) {
      this.translate.get('ERRORMESSAGE.MESSAGE.typeErrorCategoryNotSelected').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(WebDesignerMainPageTemplateEditComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: { id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
}
