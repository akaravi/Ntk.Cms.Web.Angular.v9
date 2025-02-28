import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreTokenActivationListComponent } from './activation/list/list.component';
import { CoreTokenComponent } from './core-token.component';
import { CoreLogTokenMicroServiceListComponent } from './micro-service-log/list/list.component';
import { CoreTokenMicroServiceListComponent } from './micro-service/list/list.component';
import { CoreLogTokenConnectionListComponent } from './notification-log/list/list.component';
import { CoreTokenConnectionListComponent } from './notification/list/list.component';
import { CoreTokenUserListComponent } from './user/list/list.component';
import { CoreTokenUserBadLoginListComponent } from './userBadLogin/list/list.component';
import { CoreLogTokenUserListComponent } from './userLog/list/list.component';
import { CoreTokenConnectionListOnlineComponent } from './notification/list-online/list-online.component';

const routes: Routes = [
  {
    path: '',
    component: CoreTokenComponent,
    data: { title: 'ROUTE.CORETOKEN' },
    children: [
      /** */
      {
        path: 'user',
        component: CoreTokenUserListComponent,
        data: { title: 'ROUTE.CORETOKEN.USER' },
      },
      {
        path: 'user/LinkSiteId/:LinkSiteId',
        component: CoreTokenUserListComponent,
        data: { title: 'ROUTE.CORETOKEN.USER' },
      },
      {
        path: 'user/LinkUserId/:LinkUserId',
        component: CoreTokenUserListComponent,
        data: { title: 'ROUTE.CORETOKEN.USER' },
      },
      {
        path: 'user/LinkDeviceId/:LinkDeviceId',
        component: CoreTokenUserListComponent,
        data: { title: 'ROUTE.CORETOKEN.USER' },
      },
      /** */
      {
        path: 'userlog',
        component: CoreLogTokenUserListComponent,
        data: { title: 'ROUTE.CORETOKEN.USERLOG' },
      },
      {
        path: 'userlog/LinkSiteId/:LinkSiteId',
        component: CoreLogTokenUserListComponent,
        data: { title: 'ROUTE.CORETOKEN.USERLOG' },
      },
      {
        path: 'userlog/LinkUserId/:LinkUserId',
        component: CoreLogTokenUserListComponent,
        data: { title: 'ROUTE.CORETOKEN.USERLOG' },
      },
      {
        path: 'userlog/LinkDeviceId/:LinkDeviceId',
        component: CoreLogTokenUserListComponent,
        data: { title: 'ROUTE.CORETOKEN.USERLOG' },
      },
      /** */
      {
        path: 'userbadlogin',
        component: CoreTokenUserBadLoginListComponent,
        data: { title: 'ROUTE.CORETOKEN.USERBADLOGIN' },
      },
      {
        path: 'userbadlogin/LinkSiteId/:LinkSiteId',
        component: CoreTokenUserBadLoginListComponent,
        data: { title: 'ROUTE.CORETOKEN.USERBADLOGIN' },
      },
      {
        path: 'userbadlogin/LinkUserId/:LinkUserId',
        component: CoreTokenUserBadLoginListComponent,
        data: { title: 'ROUTE.CORETOKEN.USERBADLOGIN' },
      },
      {
        path: 'userbadlogin/LinkDeviceId/:LinkDeviceId',
        component: CoreTokenUserBadLoginListComponent,
        data: { title: 'ROUTE.CORETOKEN.USERBADLOGIN' },
      },
      /** */
      {
        path: 'activation',
        component: CoreTokenActivationListComponent,
        data: { title: 'ROUTE.CORETOKEN.ACTIVATION' },
      },
      /** */
      {
        path: 'microservice',
        component: CoreTokenMicroServiceListComponent,
        data: { title: 'ROUTE.CORETOKEN.MICROSERVICE' },
      },
      /** */
      {
        path: 'microservicelog',
        component: CoreLogTokenMicroServiceListComponent,
        data: { title: 'ROUTE.CORETOKEN.MICROSERVICELOG' },
      },
      /** */
      {
        path: 'notification',
        component: CoreTokenConnectionListComponent,
        data: { title: 'ROUTE.CORETOKEN.NOTIFICATION' },
      },
      /** */
      {
        path: 'online',
        component: CoreTokenConnectionListOnlineComponent,
        data: { title: 'ROUTE.CORETOKEN.NOTIFICATION' },
      },
      
      /** */
      {
        path: 'notificationlog',
        component: CoreLogTokenConnectionListComponent,
        data: { title: 'ROUTE.CORETOKEN.NOTIFICATIONLOG' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreTokenRoutes { }
