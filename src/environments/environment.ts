// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { DeviceTypeEnum, OperatingSystemTypeEnum } from 'ntk-cms-api';
declare var require: any;

export const environment = {
  production: false,
  checkAccess: false,
  consoleLog: false,
  appVersion: require('../../package.json').version,
  appName: require('../../package.json').name,
  authKey: 'authf649fc9a5f55',
  loadDemoTheme: false,
  ProgressConsoleLog: false,
  leafletUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  mainTitle: 'سامانه مدیریتی محتوا',
  cmsServerConfig: {
    configApiRetry: 1,
    //configApiServerPath: 'https://apicms.ir/api/v2/',
    configApiServerPath: 'https://localhost:2390/api/v2/', // Test Api
    //configApiServerPath: 'https://6f4pj689-7130.euw.devtunnels.ms/api/v2/', // Test Api
    //configApiServerPath: 'https://localhost:44342/api/v2/', // Test Api Docer
    configHubServerPath: 'https://apicms.ir/hub/',
    //configHubServerPath: 'https://localhost:2390/hub/',
    configFileServerPath: 'https://apifile.ir/api/v2/',
    configQDocServerPath: 'https://qdoc.ir/api/chat',
    configCompanyWebSite: 'https://ntk.ir',
    modules: [''],
  },
  cmsTokenConfig: {
    SecurityKey: '123456789',
    ClientMACAddress: '',
    osType: OperatingSystemTypeEnum.Windows,
    DeviceType: DeviceTypeEnum.WebSite,
    PackageName: '',
  },
  cmsViewConfig: {
    mobileWindowInnerWidth: 1000,
    tableRowMouseEnter: true,
    enterAnimationDuration: '1500ms',
    exitAnimationDuration: '1000ms'
  },
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'api',
  appThemeName: 'Metronic',
  appPurchaseUrl: 'https://1.envato.market/EA4JP',
  appHTMLIntegration: 'https://preview.keenthemes.com/metronic8/demo6/documentation/base/helpers/flex-layouts.html',
  appPreviewUrl: 'https://preview.keenthemes.com/metronic8/angular/demo6/',
  appPreviewAngularUrl: 'https://preview.keenthemes.com/metronic8/angular/demo6',
  appPreviewDocsUrl: 'https://preview.keenthemes.com/metronic8/angular/docs',
  appPreviewChangelogUrl: 'https://preview.keenthemes.com/metronic8/angular/docs/changelog',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
