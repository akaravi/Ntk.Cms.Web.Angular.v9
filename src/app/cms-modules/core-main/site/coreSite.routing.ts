import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsAuthSiteGuard } from 'src/app/core/services/cmsAuthSiteGuard.service';
import { CoreSiteAddComponent } from './add/add.component';
import { CoreSiteAddFirstComponent } from './addFirst/addFirst.component';
import { CoreSiteEditComponent } from './edit/edit.component';
import { CoreInfoComponent } from './info/core-info.component';
import { CoreSiteListComponent } from './list/list.component';
import { CoreSiteModuleAddComponent } from './moduleAdd/moduleAdd.component';
import { CoreSiteModuleEditComponent } from './moduleEdit/moduleEdit.component';
import { CoreSiteModuleListComponent } from './moduleList/moduleList.component';
import { CoreSiteResellerChartComponent } from './reseller-chart/reseller-chart.component';
import { CoreSiteSelectionComponent } from './selection/selection.component';
import { CoreSiteUserListComponent } from './userList/userList.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreSiteListComponent
      },
      {
        path: 'list/LinkUserId/:LinkUserId',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteListComponent
      },
      {
        path: 'list/LinkSiteCategoryId/:LinkSiteCategoryId',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteListComponent
      },
      {
        path: 'selection',
        component: CoreSiteSelectionComponent
      },
      {
        path: 'addFirst',
        component: CoreSiteAddFirstComponent
      },
      {
        path: 'add',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteAddComponent
      },
      {
        path: 'edit',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteEditComponent
      },
      {
        path: 'edit/:Id',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteEditComponent
      },
      /** modulelist */
      {
        path: 'modulelist',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteModuleListComponent
      },
      {
        path: 'modulelist/LinkSiteId/:LinkSiteId',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteModuleListComponent
      },
      {
        path: 'modulelist/LinkModuleId/:LinkModuleId',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteModuleListComponent
      },
      /** modulelist */
      {
        path: 'moduleadd/:LinkSiteId',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteModuleAddComponent
      },
      {
        path: 'moduleadd/:LinkSiteId/:LinkModuleId',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteModuleAddComponent
      },
      {
        path: 'moduleedit/:LinkSiteId/:LinkModuleId',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteModuleEditComponent
      },
      /** userlist */
      {
        path: 'userlist',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteUserListComponent
      },
      {
        path: 'userlist/LinkSiteId/:LinkSiteId',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteUserListComponent
      },
      {
        path: 'userlist/LinkUserGroupId/:LinkUserGroupId',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteUserListComponent
      },
      {
        path: 'userlist/LinkUserId/:LinkUserId',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteUserListComponent
      },
      /** userlist */
      {
        path: 'info',
        canActivate: [CmsAuthSiteGuard],
        component: CoreInfoComponent,
        data: { title: 'ROUTE.CORE.ADDRESS' },
      },
      {
        path: 'reseller-chart',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteResellerChartComponent

      },
      {
        path: 'reseller-chart/LinkSiteId/:LinkSiteId',
        canActivate: [CmsAuthSiteGuard],
        component: CoreSiteResellerChartComponent

      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreSiteRouting {
}
