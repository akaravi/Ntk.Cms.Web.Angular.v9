
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, CoreEnumService, ErrorExceptionResult, EstateContractTypeModel,
  EstateContractTypeService, FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel
} from 'ntk-cms-api';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-estate-contract-type-selector',
  templateUrl: './selector.component.html',

})
export class EstateContractTypeSelectorComponent implements OnInit, OnDestroy {

  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public categoryService: EstateContractTypeService) {
    this.publicHelper.processService.cdr = this.cdr;
  }
  @Input() set optionSelectForce(x: string | EstateContractTypeModel) {
    if (x && ((typeof x === 'string' && x.length > 0) || typeof x === typeof EstateContractTypeModel))
      this.onActionSelectForce(x);
  }
  @Input() set optionTypeUsageId(x: string) {
    this.typeUsageId = x;
    this.loadOptions();
  }
  dataModelResult: ErrorExceptionResult<EstateContractTypeModel> = new ErrorExceptionResult<EstateContractTypeModel>();
  dataModelSelect: EstateContractTypeModel = new EstateContractTypeModel();
  formControl = new FormControl();
  filteredOptions: Observable<EstateContractTypeModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<EstateContractTypeModel>();
  @Input() optionAllowUnSelect = false;
  @Input() optionTypeView = 1;

  typeUsageId = '';
  @Input() optionReload = () => this.onActionButtonReload();
  cmsApiStoreSubscribe: Subscription;



  ngOnInit(): void {
    this.loadOptions();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe({
      next: (ret) => {
        this.loadOptions();
      }
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
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
  displayFn(model?: EstateContractTypeModel): string | undefined {
    return model ? model.titleML : undefined;
  }
  displayOption(model?: EstateContractTypeModel): string | undefined {
    return model ? model.titleML : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<EstateContractTypeModel[]> {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;
    let filter = new FilterDataModel();
    const filterChild = new FilterDataModel();
    if (text && text.length > 0) {
      filter.propertyName = 'Title';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Contains;
      filter.clauseType = ClauseTypeEnum.Or;
      filterChild.filters.push(filter);

      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filter.clauseType = ClauseTypeEnum.Or;
      filterChild.filters.push(filter);
      filterModel.filters.push(filterChild);
    }

    if (this.typeUsageId && this.typeUsageId.length > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'PropertyTypes';
      filter.propertyAnyName = 'LinkPropertyTypeUsageId';
      filter.value = this.typeUsageId;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filter.clauseType = ClauseTypeEnum.And;
      filterModel.filters.push(filter);
    }




    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    //return await
    return await firstValueFrom(this.categoryService.ServiceGetAll(filterModel))
      .then((ret) => {
        this.dataModelResult = ret;
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

        return ret.listItems;
      });


  }
  onActionSelect(model: EstateContractTypeModel): void {
    if (this.optionDisabled) {
      return;
    }
    if (this.optionAllowUnSelect && this.dataModelSelect && this.dataModelSelect.id == model.id)
      this.onActionSelectClear()
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

  push(newvalue: EstateContractTypeModel): Observable<EstateContractTypeModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | EstateContractTypeModel): void {
    if (!id || (typeof id === 'string' && id.length === 0)) {
      this.dataModelSelect = new EstateContractTypeModel();
    }
    if (typeof id === 'string' && id.length > 0) {
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
    if (typeof id === typeof EstateContractTypeModel) {
      this.filteredOptions = this.push((id as EstateContractTypeModel));
      this.dataModelSelect = (id as EstateContractTypeModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionButtonReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new EstateContractTypeModel();
    // this.optionsData.Select = new EstateContractTypeModel();
    this.loadOptions();
  }
}
