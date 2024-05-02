import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ApplicationAppService, ApplicationMemberInfoService, ArticleContentService, BiographyContentService, BlogContentService, CatalogContentService, ChartContentService, CoreConfigurationService, CoreCpMainMenuService, CoreModuleLogReportAbuseService, CoreModuleSiteCreditService, CoreSiteService, CoreUserClaimContentService, CoreUserClaimTypeService, CoreUserService, EstateCustomerOrderService, EstatePropertyHistoryService, EstatePropertyService, NewsContentService, TicketingTaskService, WebDesignerLogMemberInfoService } from 'ntk-cms-api';
import { ApplicationAppWidget2Component } from 'src/app/cms-modules/application/content/widget/widget2.component';
import { ApplicationMemberInfoWidget2Component } from 'src/app/cms-modules/application/memberInfo/widget/widget2.component';
import { ArticleContentWidget2Component } from 'src/app/cms-modules/article/content/widget/widget2.component';
import { BiographyContentWidget2Component } from 'src/app/cms-modules/biography/content/widget/widget2.component';
import { BlogContentWidget2Component } from 'src/app/cms-modules/blog/content/widget/widget2.component';
import { CatalogContentWidgetComponent } from 'src/app/cms-modules/catalog/content/widget/widget.component';
import { CatalogContentWidget2Component } from 'src/app/cms-modules/catalog/content/widget/widget2.component';
import { ChartContentWidget2Component } from 'src/app/cms-modules/chart/content/widget/widget2.component';
import { CoreSiteWidgetCountComponent } from 'src/app/cms-modules/core-main/site/widget/count/widget.component';
import { CoreSiteWidgetCount2Component } from 'src/app/cms-modules/core-main/site/widget/count/widget2.component';
import { CoreSiteWidgetModuleComponent } from 'src/app/cms-modules/core-main/site/widget/module/widget.component';
import { CoreSiteWidgetStatusComponent } from 'src/app/cms-modules/core-main/site/widget/status/widget.component';
import { CoreUserClaimContentWidgetStatusComponent } from 'src/app/cms-modules/core-main/user-claim/content/widget/widget-status.component';
import { CoreUserWidgetComponent } from 'src/app/cms-modules/core-main/user/widget/widget.component';
import { CoreModuleLogReportAbuseWidget2Component } from 'src/app/cms-modules/core-module-log/report-abuse/widget/widget2.component';
import { CoreModuleSiteCreditWidgetPriceComponent } from 'src/app/cms-modules/core-module/site-credit/widget/widget-price.component';
import { CoreModuleSiteUserCreditWidgetPriceComponent } from 'src/app/cms-modules/core-module/site-user-credit/widget/widget-price.component';
import { EstateCustomerOrderWidgetComponent } from 'src/app/cms-modules/estate/customer-order/widget/widget.component';

import { EstatePropertyHistoryWidget2Component } from 'src/app/cms-modules/estate/property-history/widget/widget2.component';
import { EstatePropertyWidgetComponent } from 'src/app/cms-modules/estate/property/widget/widget.component';
import { NewsContentWidget2Component } from 'src/app/cms-modules/news/content/widget/widget2.component';
import { TicketingTaskWidget2Component } from 'src/app/cms-modules/ticketing/task/widget/widget2.component';
import { WebDesignerLogMemberInfoWidgetComponent } from 'src/app/cms-modules/web-designer/log-member-info/widget/widget.component';
import { WebDesignerLogMemberInfoWidget2Component } from 'src/app/cms-modules/web-designer/log-member-info/widget/widget2.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { CmsHtmlWidgetComponent } from 'src/app/shared/cms-html-widget/cms-html-widget.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PageDashboardComponent } from './page-dashboard/page-dashboard.component';
import { PageMenuComponent } from './page-menu/page-menu.component';
import { PanelComponent } from './panel.component';
import { PagesPanelRoutingModule } from './panel.routing';


@NgModule({
  declarations: [
    PanelComponent,
    PageDashboardComponent,
    PageMenuComponent,
    /*widget*/
    WebDesignerLogMemberInfoWidgetComponent,
    WebDesignerLogMemberInfoWidget2Component,

    ApplicationAppWidget2Component,
    ApplicationMemberInfoWidget2Component,
    NewsContentWidget2Component,
    ChartContentWidget2Component,
    ArticleContentWidget2Component,
    BiographyContentWidget2Component,
    BlogContentWidget2Component,
    CatalogContentWidgetComponent,
    CatalogContentWidget2Component,
    CoreSiteWidgetCountComponent,
    CoreSiteWidgetCount2Component,
    CoreSiteWidgetStatusComponent,
    CoreSiteWidgetModuleComponent,
    CoreUserWidgetComponent,
    CoreUserClaimContentWidgetStatusComponent,
    CmsHtmlWidgetComponent,
    EstatePropertyWidgetComponent,
    EstateCustomerOrderWidgetComponent,

    EstatePropertyHistoryWidget2Component,
    TicketingTaskWidget2Component,
    CoreModuleLogReportAbuseWidget2Component,
    CoreModuleSiteCreditWidgetPriceComponent,
    CoreModuleSiteUserCreditWidgetPriceComponent,
    /*widget*/
  ],
  imports: [
    CommonModule,
    PagesPanelRoutingModule,
    SharedModule.forRoot(),
    ComponentsModule,
    InlineSVGModule,
    //NgApexchartsModule,
  ],
  exports: [RouterModule],
  providers: [
    CoreCpMainMenuService,
    CoreConfigurationService,
    WebDesignerLogMemberInfoService,
    ApplicationAppService,
    ApplicationMemberInfoService,
    NewsContentService,
    BiographyContentService,
    BlogContentService,
    CatalogContentService,
    EstatePropertyService,
    EstateCustomerOrderService,
    TicketingTaskService,
    ChartContentService,
    ArticleContentService,
    CoreSiteService,
    CoreUserService,
    CoreUserClaimContentService,
    CoreUserClaimTypeService,
    CoreModuleLogReportAbuseService,
    CoreModuleSiteCreditService,
    EstatePropertyHistoryService,
  ]
})
export class PanelModule { }
