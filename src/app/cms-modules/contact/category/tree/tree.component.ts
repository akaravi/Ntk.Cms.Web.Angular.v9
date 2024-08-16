
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
import {
  MatTreeNestedDataSource
} from '@angular/material/tree';
import {
  ContactCategoryModel,
  ContactCategoryService, CoreEnumService,
  ErrorExceptionResult,
  FilterModel
} from 'ntk-cms-api';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ContactCategoryDeleteComponent } from '../delete/delete.component';
import { ContactCategoryEditComponent } from '../edit/edit.component';

import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';
import { ContactCategoryAddComponent } from '../add/add.component';


@Component({
  selector: 'app-contact-category-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class ContactCategoryTreeComponent implements OnInit, OnDestroy {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: ContactCategoryService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
  }
  @Input() set optionSelectForce(x: string | ContactCategoryModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: ContactCategoryModel = new ContactCategoryModel();
  dataModelResult: ErrorExceptionResult<ContactCategoryModel> = new ErrorExceptionResult<ContactCategoryModel>();
  filterModel = new FilterModel();


  treeControl = new NestedTreeControl<ContactCategoryModel>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ContactCategoryModel>();
  @Output() optionChange = new EventEmitter<ContactCategoryModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionButtonReload();

  hasChild = (_: string, node: ContactCategoryModel) => !!node.children && node.children.length > 0;


  ngOnInit(): void {
    this.DataGetAll();
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
  onActionSelect(model: ContactCategoryModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionButtonReload(): void {
    this.onActionSelect(null);
    this.dataModelSelect = new ContactCategoryModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: string | ContactCategoryModel): void {

  }

  onActionAdd(): void {
    let parentId = '';
    if (this.dataModelSelect && this.dataModelSelect.id?.length > 0) {
      parentId = this.dataModelSelect.id;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { parentId };


    const dialogRef = this.dialog.open(ContactCategoryAddComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
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
    const dialogRef = this.dialog.open(ContactCategoryEditComponent, {
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
    // this.categoryService.ServiceDelete(this.getNodeOfId.id).subscribe((res) => {
    //   if (res.isSuccess) {
    //   }
    // });
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
    const dialogRef = this.dialog.open(ContactCategoryDeleteComponent, {
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

}
