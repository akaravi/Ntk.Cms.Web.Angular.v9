import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, CoreCurrencyModel,
  CoreCurrencyService, CoreEnumService, ErrorExceptionResult,
  FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel, ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { Observable, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';


@Component({
    selector: 'app-cms-currency-selector',
    templateUrl: './cms-currency-selector.component.html',
    standalone: false
})
export class CmsCurrencySelectorComponent implements OnInit {
  static nextId = 0;
  id = ++CmsCurrencySelectorComponent.nextId;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public categoryService: CoreCurrencyService) {
    this.publicHelper.processService.cdr = this.cdr;

  }
  dataModelResult: ErrorExceptionResult<CoreCurrencyModel> = new ErrorExceptionResult<CoreCurrencyModel>();
  dataModelSelect: CoreCurrencyModel = new CoreCurrencyModel();
  formControl = new FormControl();
  filteredOptions: Observable<CoreCurrencyModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Input() optionLabel = '';
  @Input() optionRequired = false;
  @Output() optionChange = new EventEmitter<CoreCurrencyModel>();
  @Input() optionReload = () => this.onActionButtonReload();
  @Input() set optionSelectForce(x: number | CoreCurrencyModel) {
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
            return this.DataGetAll(val);
          }
          return this.DataGetAll('');
        }),
        // tap(() => this.myControl.setValue(this.options[0]))
      );
  }

  displayFn(model?: CoreCurrencyModel): string | undefined {
    return model ? (model.titleML) : undefined;
  }
  displayOption(model?: CoreCurrencyModel): string | undefined {
    return model ? (model.titleML) : undefined;
  }

  dateUseStore = true;
  async DataGetAll(text: string | number | any): Promise<CoreCurrencyModel[]> {
    if (this.dateUseStore) {
      //** */

      this.dataModelResult = await this.publicHelper.getCurrency();
      if (this.dataModelResult.isSuccess) {
        /*select First Item */
        if (this.optionSelectFirstItem &&
          (!this.dataModelSelect || !this.dataModelSelect.id || this.dataModelSelect.id <= 0) &&
          this.dataModelResult.listItems.length > 0) {
          this.optionSelectFirstItem = false;
          setTimeout(() => { this.formControl.setValue(this.dataModelResult.listItems[0]); }, 1000);
          this.onActionSelect(this.dataModelResult.listItems[0]);
        }
        /*select First Item */
        return this.dataModelResult.listItems;
      }
      //** */
    }       //** */
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;

    if (text && text.length > 0) {
      let filter = new FilterDataModel();
      /*Filters */
      filter = new FilterDataModel();
      filter.propertyName = 'Symbol';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Contains;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);
      /*Filters */
      filter = new FilterDataModel();
      filter.propertyName = 'Title';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Contains;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);

      if (text && typeof +text === 'number' && +text > 0) {
        /*Filters */
        filter = new FilterDataModel();
        filter.propertyName = 'Id';
        filter.value = text;
        filter.searchType = FilterDataModelSearchTypesEnum.Equal;
        filter.clauseType = ClauseTypeEnum.Or;
        filterModel.filters.push(filter);

      }
    }

    const pName = this.constructor.name + 'ServiceGetAll';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.categoryService.setAccessDataType(ManageUserAccessDataTypesEnum.Viewer);
    return await firstValueFrom(this.categoryService.ServiceGetAll(filterModel))
      .then(
        (response) => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.id || this.dataModelSelect.id <= 0) &&
            this.dataModelResult.listItems.length > 0) {
            this.optionSelectFirstItem = false;
            setTimeout(() => { this.formControl.setValue(this.dataModelResult.listItems[0]); }, 1000);
            this.onActionSelect(this.dataModelResult.listItems[0]);
          }
          /*select First Item */
          this.publicHelper.processService.processStop(pName);

          return response.listItems;
        });
    //** */

  }
  onActionSelect(model: CoreCurrencyModel): void {
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
  push(newvalue: CoreCurrencyModel): Observable<CoreCurrencyModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | CoreCurrencyModel): void {
    if (typeof id === 'number' && id > 0) {
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
          }
        }
      });
      return;
    }
    if (typeof id === typeof CoreCurrencyModel) {
      this.filteredOptions = this.push((id as CoreCurrencyModel));
      this.dataModelSelect = (id as CoreCurrencyModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionButtonReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new CoreCurrencyModel();
    // this.optionsData.Select = new CoreCurrencyModel();
    this.loadOptions();
  }
}
