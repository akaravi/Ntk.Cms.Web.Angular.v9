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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  MatTreeNestedDataSource
} from '@angular/material/tree';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, ErrorExceptionResult,
  FilterModel, SortTypeEnum, WebDesignerMainMenuModel,
  WebDesignerMainMenuService
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';
import { WebDesignerMainMenuAddComponent } from '../add/add.component';
import { WebDesignerMainMenuEditComponent } from '../edit/edit.component';
@Component({
  selector: 'app-webdesigner-menu-tree',
  templateUrl: './tree.component.html',
})
export class WebDesignerMainMenuTreeComponent implements OnInit, OnDestroy {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: WebDesignerMainMenuService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    this.filterModel.sortColumn = 'ShowInMenuOrder';
    this.filterModel.sortType = SortTypeEnum.Ascending;
  }
  @Input() set optionSelectForce(x: number | WebDesignerMainMenuModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: WebDesignerMainMenuModel = new WebDesignerMainMenuModel();
  dataModelResult: ErrorExceptionResult<WebDesignerMainMenuModel> = new ErrorExceptionResult<WebDesignerMainMenuModel>();
  filterModel = new FilterModel();


  treeControl = new NestedTreeControl<WebDesignerMainMenuModel>(node => node.children);
  dataSource = new MatTreeNestedDataSource<WebDesignerMainMenuModel>();
  @Output() optionChange = new EventEmitter<WebDesignerMainMenuModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionButtonReload();
  hasChild = (_: number, node: WebDesignerMainMenuModel) => !!node.children && node.children.length > 0;
  ngOnInit(): void {
    this.DataGetAll();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
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
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });
    this.categoryService.ServiceGetAllTree(this.filterModel).subscribe({
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
  onActionSelect(model: WebDesignerMainMenuModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionButtonReload(): void {
    this.onActionSelect(null);
    this.dataModelSelect = new WebDesignerMainMenuModel();
    // this.optionsData.data.Select = new WebDesignerMainMenuModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | WebDesignerMainMenuModel): void {
  }
  onActionAdd(): void {
    let parentId = '';
    if (this.dataModelSelect && this.dataModelSelect?.id?.length > 0) {
      parentId = this.dataModelSelect.id;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { parentId };
    const dialogRef = this.dialog.open(WebDesignerMainMenuAddComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionEdit(): void {
    let id = '';
    if (this.dataModelSelect && this.dataModelSelect?.id?.length > 0) {
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
    const dialogRef = this.dialog.open(WebDesignerMainMenuEditComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: { id }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionDelete(): void {
    let id = '';
    if (this.dataModelSelect && this.dataModelSelect?.id?.length > 0) {
      id = this.dataModelSelect.id;
    }
    if (id.length === 0) {
      this.translate.get('ERRORMESSAGE.MESSAGE.typeErrorCategoryNotSelected').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
  }
}
