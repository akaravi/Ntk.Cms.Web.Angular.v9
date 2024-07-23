
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, CoreEnumService, ErrorExceptionResult, EstateAccountUserFilterModel, EstateAccountUserModel,
  EstateAccountUserService, FilterDataModel, FilterDataModelSearchTypesEnum
} from 'ntk-cms-api';
import { Observable, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-estate-account-user-selector',
  templateUrl: './selector.component.html',
})
export class EstateAccountUserSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public categoryService: EstateAccountUserService) {
    this.publicHelper.processService.cdr = this.cdr;


  }
  dataModelResult: ErrorExceptionResult<EstateAccountUserModel> = new ErrorExceptionResult<EstateAccountUserModel>();
  dataModelSelect: EstateAccountUserModel = new EstateAccountUserModel();
  formControl = new FormControl();
  filteredOptions: Observable<EstateAccountUserModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Input() optionLabel = '';
  @Input() optionRequired = false;
  @Output() optionChange = new EventEmitter<EstateAccountUserModel>();
  @Input() optionReload = () => this.onActionButtonReload();
  @Input() set optionSelectForce(x: string | number | EstateAccountUserModel) {
    this.onActionSelectForce(x);
  }




  ngOnInit(): void {
    this.loadOptions();
    if (!this.optionLabel || this.optionLabel.length == 0 && this.optionPlaceholder?.length > 0)
      this.optionLabel = this.optionPlaceholder;
  }
  loadOptions(): void {
    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1500),
        distinctUntilChanged(),
        switchMap(val => {
          if (typeof val === 'string' || typeof val === 'number') {
            return this.DataGetAll(val || '');
          }
          return [];
        }),
        // tap(() => this.myControl.setValue(this.options[0]))
      );
  }

  displayFn(model?: EstateAccountUserModel): string | undefined {
    return model ? model.title : undefined;
  }
  displayOption(model?: EstateAccountUserModel): string | undefined {
    return model ? model.title : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<EstateAccountUserModel[]> {
    const filterModel = new EstateAccountUserFilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;

    let filter = new FilterDataModel();
    if (typeof text === 'string' && text.length > 0) {
      filter.propertyName = 'Title';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Contains;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);
      /* */
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);
    }
    /* */
    if (typeof text === 'number' && text > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'LinkCmsUserId';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);
    }

    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    return await firstValueFrom(this.categoryService.ServiceGetAll(filterModel))
      .then(
        (response) => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.id || this.dataModelSelect.id.length === 0) &&
            this.dataModelResult.listItems.length > 0) {
            this.optionSelectFirstItem = false;
            setTimeout(() => { this.formControl.setValue(this.dataModelResult.listItems[0]); }, 1000);
            this.onActionSelect(this.dataModelResult.listItems[0]);
          }
          /*select First Item */
          this.publicHelper.processService.processStop(pName);

          return response.listItems;
        });
  }
  onActionSelect(model: EstateAccountUserModel): void {
    if (this.optionDisabled) {
      return;
    }
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionSelectClear(): void {
    if (this.optionDisabled) {
      return;
    }
    this.dataModelSelect = null;
    this.formControl.setValue(null);
    this.optionChange.emit(null);
  }

  push(newvalue: EstateAccountUserModel): Observable<EstateAccountUserModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | number | EstateAccountUserModel): void {
    if (typeof id === 'number' && id > 0) {
      if (this.dataModelSelect && this.dataModelSelect.linkCmsUserId === id) {
        return;
      }
      if (this.dataModelResult && this.dataModelResult.listItems && this.dataModelResult.listItems.find(x => x.linkCmsUserId === id)) {
        const item = this.dataModelResult.listItems.find(x => x.linkCmsUserId === id);
        this.dataModelSelect = item;
        this.formControl.setValue(item);
        return;
      }
      const filterModel = new EstateAccountUserFilterModel();

      const filter = new FilterDataModel();
      filter.propertyName = 'LinkCmsUserId';
      filter.value = id;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filterModel.filters.push(filter);

      this.categoryService.ServiceGetAll(filterModel).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            if (ret.listItems.length > 0) {
              this.filteredOptions = this.push(ret.listItems[0]);
              this.dataModelSelect = ret.listItems[0];
              this.formControl.setValue(ret.listItems[0]);
              this.optionChange.emit(ret.listItems[0]);
            } else {
              this.cmsToastrService.typeErrorMessage(ret.errorMessage);
            }
          }
        }
      });
      return;
    }
    else if (typeof id === 'string' && id.length > 0) {
      if (this.dataModelSelect && this.dataModelSelect.id === id) {
        return;
      }
      if (this.dataModelResult && this.dataModelResult.listItems && this.dataModelResult.listItems.find(x => x.id === id)) {
        const item = this.dataModelResult.listItems.find(x => x.id === id);
        this.dataModelSelect = item;
        this.formControl.setValue(item);
        return;
      }
      this.categoryService.ServiceGetOneById(id).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.filteredOptions = this.push(ret.item);
            this.dataModelSelect = ret.item;
            this.formControl.setValue(ret.item);
            this.optionChange.emit(ret.item);
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
        }
      });
      return;
    }
    if (typeof id === typeof EstateAccountUserModel) {
      this.filteredOptions = this.push((id as EstateAccountUserModel));
      this.dataModelSelect = (id as EstateAccountUserModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionButtonReload(): void {
    this.dataModelSelect = new EstateAccountUserModel();
    this.loadOptions();
  }
}
