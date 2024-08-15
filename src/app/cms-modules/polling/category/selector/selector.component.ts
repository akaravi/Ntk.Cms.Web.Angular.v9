
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, CoreEnumService, ErrorExceptionResult,
  FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel,
  PollingCategoryModel,
  PollingCategoryService
} from 'ntk-cms-api';
import { Observable, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-polling-category-selector',
  templateUrl: './selector.component.html',

})
export class PollingCategorySelectorComponent implements OnInit {
  static nextId = 0;
  id = ++PollingCategorySelectorComponent.nextId;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
    public categoryService: PollingCategoryService) {
    this.publicHelper.processService.cdr = this.cdr;

  }
  dataModelResult: ErrorExceptionResult<PollingCategoryModel> = new ErrorExceptionResult<PollingCategoryModel>();
  dataModelSelect: PollingCategoryModel = new PollingCategoryModel();
  formControl = new FormControl();
  filteredOptions: Observable<PollingCategoryModel[]>;
  @Input() optionPlaceholder = '';
  @Input() optionSelectFirstItem = false;
  @Input() optionDisabled = false;
  @Input() optionRequired = false;
  @Input() optionLabel = '';
  @Output() optionChange = new EventEmitter<PollingCategoryModel>();
  @Input() optionReload = () => this.onActionButtonReload();
  @Input() set optionSelectForce(x: number | PollingCategoryModel) {
    this.onActionSelectForce(x);
  }




  ngOnInit(): void {
    this.loadOptions();
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

  displayFn(model?: PollingCategoryModel): string | undefined {
    return model ? model.title : undefined;
  }
  displayOption(model?: PollingCategoryModel): string | undefined {
    return model ? model.title : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<PollingCategoryModel[]> {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;

    let filter = new FilterDataModel();
    filter.propertyName = 'Title';
    filter.value = text;
    filter.searchType = FilterDataModelSearchTypesEnum.Contains;
    filter.clauseType = ClauseTypeEnum.Or;
    filterModel.filters.push(filter);
    if (text && typeof +text === 'number' && +text > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
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
  }
  onActionSelect(model: PollingCategoryModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);

  }
  onActionSelectClear(): void {
    this.dataModelSelect = null;
    this.formControl.setValue(null);
    this.optionChange.emit(null);
  }
  push(newvalue: PollingCategoryModel): Observable<PollingCategoryModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | PollingCategoryModel): void {
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
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
        }
      });
      return;
    }
    if (typeof id === typeof PollingCategoryModel) {
      this.filteredOptions = this.push((id as PollingCategoryModel));
      this.dataModelSelect = (id as PollingCategoryModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionButtonReload(): void {
    this.dataModelSelect = new PollingCategoryModel();
    this.loadOptions();
  }
}
