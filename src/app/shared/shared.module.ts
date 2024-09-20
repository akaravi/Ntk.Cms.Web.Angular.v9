import { TreeModule } from '@ali-hm/angular-tree-component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PlatformModule } from '@angular/cdk/platform';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatRippleModule
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import {
  ApplicationAppService,
  BankPaymentEnumService,
  BankPaymentPrivateSiteConfigService,
  BankPaymentTransactionService,
  CoreCurrencyService,
  CoreGuideService,
  CoreLocationService,
  CoreLogMemberService,
  CoreModuleDataCommentService,
  CoreModuleDataMemoService,
  CoreModuleDataPinService,
  CoreModuleDataTaskService,
  CoreModuleSiteCreditService,
  CoreModuleSiteUserCreditService,
  CoreSiteCategoryService,
  CoreSiteService,
  CoreUserGroupService,
  CoreUserService,
  MemberUserService,
  SmsMainApiNumberService,
  SmsMainApiPathService
} from 'ntk-cms-api';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NgOtpInputModule } from '../core/cmsComponent/ng-otp-input/ng-otp-input.module';
import { CmsHtmlTreeActionDirective, CmsHtmlTreeBodyDirective, CmsHtmlTreeFooterDirective, CmsHtmlTreeHeaderDirective } from '../core/directive/cms-html-tree.directive';
import { CmsRecordStatusSelfSaveDirective } from '../core/directive/cms-record-status-self-save.directive';
import { DirDirective } from '../core/directive/dir.directive';
import { InlineSVGComponent } from '../core/directive/inline-svg.component';
import { InlineSVGDirective } from '../core/directive/inline-svg.directive';
import { MatInputCommifiedDirective } from '../core/directive/mat-input-commified.directive';
import { MatVerticalStepperScrollerDirective } from '../core/directive/mat-vertical-stepper.directive';
import { ClipboardIfSupportedDirective } from '../core/directive/ngx-clipboard-if-supported.directive';
import { ClipboardDirective } from '../core/directive/ngx-clipboard.directive';
import { PhoneDirective } from '../core/directive/phone.directive';
import { RunScriptsDirective } from '../core/directive/runScripts.directive';
import { SelfSaveDirective } from '../core/directive/self-save.directive';
import { TooltipGuideDirective } from '../core/directive/tooltip-guide.directive';
import { TooltipDirective } from '../core/directive/tooltip.directive';
import { BooleanComponent } from '../core/dynamic-input-builder/boolean/boolean.component';
import { DateComponent } from '../core/dynamic-input-builder/date/date.component';
import { FloatComponent } from '../core/dynamic-input-builder/float/float.component';
import { IntComponent } from '../core/dynamic-input-builder/int/int.component';
import { StringComponent } from '../core/dynamic-input-builder/string/string.component';
import { TextAreaComponent } from '../core/dynamic-input-builder/text-area/text-area.component';
import { CmsTranslationService } from '../core/i18n/translation.service';
import { HttpConfigInterceptor } from '../core/interceptor/httpConfigInterceptor';
import { BoolStatusClassPipe } from '../core/pipe/boolStatusClass.pipe';
import { CmsImageThumbnailPipe } from '../core/pipe/cms-image-thumbnail.pipe';
import { CmsTitlePipe } from '../core/pipe/cms-title.pipe';
import { CmsModuleInfoPipe } from '../core/pipe/core/cms-module-info.pipe';
import { CmsSiteInfoPipe } from '../core/pipe/core/cms-site-info.pipe';
import { CmsUserInfoPipe } from '../core/pipe/core/cms-user-info.pipe';
import { EnumsPipe } from '../core/pipe/enums.pipe';
import { FirstLetterPipe } from '../core/pipe/first-letter.pipe';
import { ListKeysPipe } from '../core/pipe/list-keys.pipe';
import { PersianDateFull } from '../core/pipe/persian-date/persian-date-full.pipe';
import { PersianDate } from '../core/pipe/persian-date/persian-date.pipe';
import { PrettyjsonPipe } from '../core/pipe/prettyjson.pipe';
import { RecordStatusCellClassPipe } from '../core/pipe/recordStatusCellClass.pipe';
import { RecordStatusIconClassPipe } from '../core/pipe/recordStatusIconClass.pipe';
import { ReplaceTextPipe } from '../core/pipe/repalaceTest.pip';
import { SafePipe } from '../core/pipe/safe.pipe';
import { SafeHtmlPipe } from '../core/pipe/safeHtml.pipe';
import { SortTypeIconClassPipe } from '../core/pipe/sortTypeIconClass.pipe';
import { TruncatePipe } from '../core/pipe/truncate.pipe';
import { ValueArrayPipe } from '../core/pipe/valueArray.pipe';
import { NgxQueryBuilderComponent } from '../core/query-builder/ngx-ntk-query-builder.component';
import { Cms360ImageListComponent } from './cms-360-image-list/cms-360-image-list.component';
import { Cms360TourListComponent } from './cms-360-tour-list/cms-360-tour-list.component';
import { CmsAccessInfoComponent } from './cms-access-info/cms-access-info.component';
import { CmsApplicationSelectorComponent } from './cms-application-selector/cms-application-selector.component';
import { CmsBankpaymentGridComponent } from './cms-bankpayment-grid/cms-bankpayment-grid.component';
import { CmsBankpaymentTransactionInfoComponent } from './cms-bankpayment-transaction-info/cms-bankpayment-transaction-info.component';
import { CmsContactCategoryTreeSelectorComponent } from './cms-contact-category-tree-selector/cms-contact-category-tree-selector.component';
import { CmsContactContentSelectionListComponent } from './cms-contact-content-selection-list/cms-contact-content-selection-list.component';
import { CmsCurrencySelectorComponent } from './cms-currency-selector/cms-currency-selector.component';
import { CmsDataCommentComponent } from './cms-data-comment/cms-data-comment.component';
import { CmsDataMemoComponent } from './cms-data-memo/cms-data-memo.component';
import { CmsDataPinComponent } from './cms-data-pin/cms-data-pin.component';
import { CmsDataTaskComponent } from './cms-data-task/cms-data-task.component';
import { CmsEnumRecordStatusSelectorComponent } from './cms-enum-record-status-selector/cms-enum-record-status-selector.component';
import { CmsEnumXSelectorComponent } from './cms-enum-x-selector/cms-enum-x-selector.component';
import { CmsExportEntityComponent } from './cms-export-entity/cms-export-entity.component';
import { CmsExportListComponent } from './cms-export-list/cmsExportList.component';
import { CmsFilesSelectorComponent } from './cms-files-selector/cms-files-selector.component';
import { CmsFormBuilderPropertiesComponent } from './cms-form-builder-properties/cms-form-builder-properties.component';
import { CmsGuideinfoComponent } from './cms-guide-info/cms-guide-info.component';
import { CmsGuideNoticeComponent } from './cms-guide-notice/cms-guide-notice.component';
import { CmsHtmlCardComponent } from './cms-html-card/cms-html-card.component';
import { CmsHtmlListComponent } from './cms-html-list/cms-html-list.component';
import { CmsHtmlModalComponent } from './cms-html-modal/cms-html-modal.component';
import { CmsHtmlNoticeComponent } from './cms-html-notice/cms-html-notice.component';
import { CmsHtmlTreeComponent } from './cms-html-tree/cms-html-tree.component';
import { CmsJsonListComponent } from './cms-json-list/cmsJsonList.component';
import { CmsLinkToComponent } from './cms-link-to/cms-link-to.component';
import { CmsLocationCompleteComponent } from './cms-location-autocomplete/cms-location-autocomplete.component';
import { CmsLocationSelectorComponent } from './cms-location-selector/cms-location-selector.component';
import { CmsMapComponent } from './cms-map/cms-map.component';
import { CmsMemberSelectorComponent } from './cms-member-selector/cmsMemberSelector.component';
import { CmsModuleSelectorComponent } from './cms-module-selector/cms-module-selector.component';
import { CmsQDocComponent } from './cms-qdoc/cms-qdoc.component';
import { CmsSearchListComponent } from './cms-search-list/cms-search-list.component';
import { CmsShowKeyComponent } from './cms-show-key/cms-show-key.component';
import { CmsSiteCategorySelectionListComponent } from './cms-site-category-selection-list/cmsSiteCategorySelectionList.component';
import { CmsSiteCategorySelectorComponent } from './cms-site-category-selector/cmsSiteCategorySelector.component';
import { CmsSiteCreditViewComponent } from './cms-site-credit-view/cms-site-credit-view.component';
import { CmsSiteSelectorComponent } from './cms-site-selector/cmsSiteSelector.component';
import { CmsSiteUserCreditViewComponent } from './cms-site-user-credit-view/cms-site-user-credit-view.component';
import { CmsSmsMainApiNumberSelectorComponent } from './cms-sms-api-number-selector/cms-sms-api-number-selector.component';
import { CmsSmsMainApiPathSelectorComponent } from './cms-sms-apipath-selector/cms-sms-apipath-selector.component';
import { CmsStatistListComponent } from './cms-statist-list/cms-statist-list.component';
import { CmsTagAutocompleteComponent } from './cms-tag-autocomplete/cms-tag-autocomplete.component';
import { CmsTokenAccessComponent } from './cms-token-access/cmsTokenAccess.component';
import { CmsUserGroupSelectorComponent } from './cms-user-group-selector/cmsUserGroupSelector.component';
import { CmsUserSelectorComponent } from './cms-user-selector/cmsUserSelector.component';
import { CmsViewComponent } from './cms-view/cms-view.component';
import { MaterialPersianDateAdapter, PERSIAN_DATE_FORMATS } from './material/material.persian-date.adapter';
import { OverlayService } from './overlay/overlay.service';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { CmsEnumXSelectionListComponent } from './cms-enum-x-selectionlist/cms-enum-x-selectionlist.component';
import { PrettyLinePipe } from '../core/pipe/prettyLine.pipe';


@NgModule({
  declarations: [
    // common and shared components/directives/pipes between more than one module and components will be listed here.
    PersianDate,
    PersianDateFull,
    /** pipe */
    TruncatePipe,
    ListKeysPipe,
    SafeHtmlPipe,
    EnumsPipe,
    CmsTitlePipe,
    CmsUserInfoPipe,
    CmsSiteInfoPipe,
    CmsModuleInfoPipe,
    CmsImageThumbnailPipe,
    PrettyjsonPipe,
    PrettyLinePipe,
    RecordStatusIconClassPipe,
    RecordStatusCellClassPipe,
    SortTypeIconClassPipe,
    ReplaceTextPipe,
    BoolStatusClassPipe,
    ValueArrayPipe,
    FirstLetterPipe,
    SafePipe,
    /** Component */

    CmsSearchListComponent,
    CmsStatistListComponent,
    CmsExportListComponent,
    CmsSiteSelectorComponent,
    CmsCurrencySelectorComponent,
    CmsEnumRecordStatusSelectorComponent,
    CmsEnumXSelectorComponent,
    CmsEnumXSelectionListComponent,
    CmsLocationSelectorComponent,
    CmsLocationCompleteComponent,
    CmsApplicationSelectorComponent,
    CmsSiteCategorySelectorComponent,
    CmsSiteCategorySelectionListComponent,
    CmsUserSelectorComponent,
    CmsUserGroupSelectorComponent,
    CmsMemberSelectorComponent,
    CmsModuleSelectorComponent,
    CmsExportEntityComponent,
    Cms360ImageListComponent,
    Cms360TourListComponent,
    CmsQDocComponent,
    CmsViewComponent,
    CmsLinkToComponent,
    CmsDataMemoComponent,
    CmsDataPinComponent,
    CmsDataTaskComponent,
    CmsDataCommentComponent,
    CmsShowKeyComponent,
    CmsMapComponent,
    CmsTagAutocompleteComponent,
    ProgressSpinnerComponent,
    PasswordStrengthComponent,
    CmsJsonListComponent,
    CmsGuideinfoComponent,
    CmsGuideNoticeComponent,
    CmsFormBuilderPropertiesComponent,
    CmsBankpaymentGridComponent,
    CmsBankpaymentTransactionInfoComponent,
    CmsFilesSelectorComponent,
    CmsTokenAccessComponent,
    CmsHtmlNoticeComponent,
    CmsHtmlCardComponent,
    CmsHtmlModalComponent,
    CmsHtmlListComponent,
    CmsHtmlTreeComponent,
    CmsSiteCreditViewComponent,
    CmsSiteUserCreditViewComponent,
    CmsContactCategoryTreeSelectorComponent,
    CmsContactContentSelectionListComponent,
    CmsAccessInfoComponent,
    CmsSmsMainApiPathSelectorComponent,
    CmsSmsMainApiNumberSelectorComponent,
    NgxQueryBuilderComponent,
    /** input */
    StringComponent,
    IntComponent,
    BooleanComponent,
    FloatComponent,
    DateComponent,
    TextAreaComponent,
    /** Directive */
    TooltipGuideDirective,
    TooltipDirective,
    DirDirective,
    PhoneDirective,
    RunScriptsDirective,
    CmsHtmlTreeHeaderDirective,
    CmsHtmlTreeActionDirective,
    CmsHtmlTreeBodyDirective,
    CmsHtmlTreeFooterDirective,
    MatInputCommifiedDirective,
    MatVerticalStepperScrollerDirective,
    SelfSaveDirective,
    CmsRecordStatusSelfSaveDirective,
    ClipboardIfSupportedDirective,
    ClipboardDirective,
    InlineSVGDirective, InlineSVGComponent
  ],

  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    OverlayService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    { provide: DateAdapter, useClass: MaterialPersianDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS },
    TranslateService,
    MemberUserService,
    CoreLogMemberService,
    CoreUserService,
    CoreUserGroupService,
    CoreSiteService,
    CoreSiteCategoryService,
    CoreGuideService,
    CoreCurrencyService,
    CoreLocationService,
    ApplicationAppService,
    BankPaymentPrivateSiteConfigService,
    BankPaymentTransactionService,
    BankPaymentEnumService,
    CoreModuleSiteCreditService,
    CoreModuleSiteUserCreditService,
    CoreModuleDataMemoService,
    CoreModuleDataTaskService,
    CoreModuleDataPinService,
    CoreModuleDataCommentService,
    SmsMainApiPathService,
    SmsMainApiNumberService,
    // provideHttpClient(withInterceptorsFromDi()),

  ],

  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forChild({}),
    // TranslateModule.forChild({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
    //     deps: [HttpClient]
    //   },
    //   isolate: true, // <-- PLAY WITH IT
    //   extend: true // <-- PLAY WITH IT
    // }),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    CurrencyMaskModule,
    NgApexchartsModule,
    //Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    CdkTableModule,
    PlatformModule,
    MatTreeModule,
    //Material
    TreeModule,
    LeafletModule,
    ClipboardModule,
    NgbDropdownModule,
    NgbNavModule,
    NgOtpInputModule,
    CmsFileManagerModule.forRoot(),

  ],
  exports: [
    // common and shared components/directives/pipes between more than one module and components will be listed here.
    CommonModule,
    TranslateModule,
    FormsModule,
    NgApexchartsModule,
    //Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    CdkTableModule,
    PlatformModule,
    MatTreeModule,
    //Material
    TreeModule,
    ClipboardModule,
    PersianDate,
    PersianDateFull,
    /** pipe */
    TruncatePipe,
    FirstLetterPipe,
    SafePipe,
    ListKeysPipe,
    SafeHtmlPipe,
    EnumsPipe,
    CmsTitlePipe,
    CmsUserInfoPipe,
    CmsSiteInfoPipe,
    CmsModuleInfoPipe,
    CmsImageThumbnailPipe,
    PrettyjsonPipe,
    PrettyLinePipe,
    RecordStatusIconClassPipe,
    RecordStatusCellClassPipe,
    SortTypeIconClassPipe,
    ReplaceTextPipe,
    BoolStatusClassPipe,
    ValueArrayPipe,
    /** Component */

    CmsSearchListComponent,
    CmsStatistListComponent,
    CmsExportListComponent,
    CmsSiteSelectorComponent,
    CmsCurrencySelectorComponent,
    CmsEnumRecordStatusSelectorComponent,
    CmsEnumXSelectorComponent,
    CmsEnumXSelectionListComponent,
    CmsLocationSelectorComponent,
    CmsLocationCompleteComponent,
    CmsApplicationSelectorComponent,
    CmsSiteCategorySelectorComponent,
    CmsSiteCategorySelectionListComponent,
    CmsUserSelectorComponent,
    CmsUserGroupSelectorComponent,
    CmsMemberSelectorComponent,
    CmsModuleSelectorComponent,
    CmsExportEntityComponent,
    Cms360ImageListComponent,
    Cms360TourListComponent,
    CmsMapComponent,
    CmsQDocComponent,
    CmsViewComponent,
    CmsLinkToComponent,
    CmsDataMemoComponent,
    CmsDataPinComponent,
    CmsDataTaskComponent,
    CmsDataCommentComponent,
    CmsShowKeyComponent,
    CmsTagAutocompleteComponent,
    ProgressSpinnerComponent,
    PasswordStrengthComponent,
    CmsJsonListComponent,
    CmsGuideinfoComponent,
    CmsGuideNoticeComponent,
    CmsFormBuilderPropertiesComponent,
    CmsBankpaymentGridComponent,
    CmsBankpaymentTransactionInfoComponent,
    CmsFilesSelectorComponent,
    CmsTokenAccessComponent,
    CmsHtmlNoticeComponent,
    CmsHtmlCardComponent,
    CmsHtmlModalComponent,
    CmsHtmlListComponent,
    CmsHtmlTreeComponent,
    CmsSiteCreditViewComponent,
    CmsSiteUserCreditViewComponent,
    CmsContactCategoryTreeSelectorComponent,
    CmsContactContentSelectionListComponent,
    CmsAccessInfoComponent,
    CmsSmsMainApiPathSelectorComponent,
    CmsSmsMainApiNumberSelectorComponent,
    NgxQueryBuilderComponent,
    /** input */
    StringComponent,
    IntComponent,
    BooleanComponent,
    FloatComponent,
    DateComponent,
    TextAreaComponent,
    /** Directive */
    TooltipGuideDirective,
    TooltipDirective,
    DirDirective,
    PhoneDirective,
    RunScriptsDirective,
    CmsHtmlTreeHeaderDirective,
    CmsHtmlTreeActionDirective,
    CmsHtmlTreeBodyDirective,
    CmsHtmlTreeFooterDirective,
    MatInputCommifiedDirective,
    MatVerticalStepperScrollerDirective,
    SelfSaveDirective,
    CmsRecordStatusSelfSaveDirective,
    ClipboardIfSupportedDirective,
    ClipboardDirective,
    InlineSVGDirective,

  ],
})
export class SharedModule {
  /**
 * === README ========================================================================
 * This block is not needed if you use `isolate: false`. But with `isolate: false` you
 * cannot read the lazy-specific translations, even if you set `extend: true`.
 *
 * PROBLEM: I can't have a configuration that allows reading translations from parent
 * non-lazy modules at the same time I read the lazy loaded module files.
 *
 *   To make a child module extend translations from parent modules use `extend: true`.
 *   This will cause the service to also use translations from its parent module.
 *
 *   You can also isolate the service by using `isolate: true`. In which case the service
 *   is a completely isolated instance (for translations, current lang, events, ...).
 *   Otherwise, by default, it will share its data with other instances of the service
 *   (but you can still use a different loader/compiler/parser/handler even if you don't
 *   isolate the service).
 * ====================================================================================
 * */
  constructor(public translationService: TranslateService, public cmsTranslationService: CmsTranslationService) {
    const currentLang = this.translationService.currentLang;
    this.translationService.currentLang = '';
    this.translationService.store.onLangChange.subscribe(
      (lang: LangChangeEvent) => {
        translationService.setDefaultLang(lang.lang);
        if (environment.consoleLog)
          console.log(' ==> LazyLoadedModule ', lang);
        try {
          firstValueFrom(translationService.use(lang.lang));
        } catch (err) {
          if (environment.consoleLog)
            console.log(err);
        }
      }
    );
  }
  static forRoot(): ModuleWithProviders {
    // Forcing the whole app to use the returned providers from the AppModule only.
    return {
      ngModule: SharedModule,
      providers: [
        /* All of your services here. It will hold the services needed by itself`. */
      ],
    };
  }
}
