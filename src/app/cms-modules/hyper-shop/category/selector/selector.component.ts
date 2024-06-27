
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, CoreEnumService, ErrorExceptionResult,
  FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel,
  HyperShopCategoryModel,
  HyperShopCategoryService
} from 'ntk-cms-api';
import { Observable, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-hypershop-category-selector',
  templateUrl: './selector.component.html',
})
export class HyperShopCategorySelectorComponent implements OnInit {
  static nextId = 0;
  id = ++HyperShopCategorySelectorComponent.nextId;
  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private publicHelper: PublicHelper,
    public categoryService: HyperShopCategoryService) {
    this.loading.cdr = this.cdr; this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
  }
  dataModelResult: ErrorExceptionResult<HyperShopCategoryModel> = new ErrorExceptionResult<HyperShopCategoryModel>();
  dataModelSelect: HyperShopCategoryModel = new HyperShopCategoryModel();
  formControl = new FormControl();
  filteredOptions: Observable<HyperShopCategoryModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Input() optionLabel = '';
  @Output() optionChange = new EventEmitter<HyperShopCategoryModel>();
  @Input() optionReload = () => this.onActionButtonReload();
  @Input() set optionSelectForce(x: string | HyperShopCategoryModel) {
    this.onActionSelectForce(x);
  }

  loading: ProgressSpinnerModel = new ProgressSpinnerModel();
  get optionLoading(): ProgressSpinnerModel {
    return this.loading;
  }
  @Input() set optionLoading(value: ProgressSpinnerModel) {
    this.loading = value;
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

  displayFn(model?: HyperShopCategoryModel): string | undefined {
    return model ? model.name + ' # ' + model.code : undefined;
  }
  displayOption(model?: HyperShopCategoryModel): string | undefined {
    return model ? model.name + ' # ' + model.code : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<HyperShopCategoryModel[]> {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;
    // this.loading.backdropEnabled = false;
    let filter = new FilterDataModel();
    filter.propertyName = 'Name';
    filter.value = text;
    filter.searchType = FilterDataModelSearchTypesEnum.Contains;
    filterModel.filters.push(filter);
    /* */
    filter = new FilterDataModel();
    filter.propertyName = 'Code';
    filter.value = text;
    filter.searchType = FilterDataModelSearchTypesEnum.Equal;
    filter.clauseType = ClauseTypeEnum.Or;
    filterModel.filters.push(filter);


    const pName = this.constructor.name + 'main';
    this.publicHelper.processService.processStart(pName);

    return await firstValueFrom(this.categoryService.ServiceGetAll(filterModel))
      .then(
        (response) => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.code || this.dataModelSelect.code.length === 0) &&
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
  onActionSelect(model: HyperShopCategoryModel): void {
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

  push(newvalue: HyperShopCategoryModel): Observable<HyperShopCategoryModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.code === newvalue.code)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | HyperShopCategoryModel): void {
    if (typeof id === 'string' && id.length > 0) {
      if (this.dataModelSelect && this.dataModelSelect.code === id) {
        return;
      }
      if (this.dataModelResult && this.dataModelResult.listItems && this.dataModelResult.listItems.find(x => x.code === id)) {
        const item = this.dataModelResult.listItems.find(x => x.code === id);
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
    if (typeof id === typeof HyperShopCategoryModel) {
      this.filteredOptions = this.push((id as HyperShopCategoryModel));
      this.dataModelSelect = (id as HyperShopCategoryModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionButtonReload(): void {
    this.dataModelSelect = new HyperShopCategoryModel();
    this.loadOptions();
  }
}
