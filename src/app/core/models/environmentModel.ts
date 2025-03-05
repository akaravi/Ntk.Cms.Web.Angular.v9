import { DeviceTypeEnum, OperatingSystemTypeEnum } from "ntk-cms-api"

export interface EnvironmentModel{
   production: boolean,
    checkAccess: boolean,
    consoleLog: boolean,
    appVersion: string,
    appName: string,
    authKey: string,
    loadDemoTheme: boolean,
    ProgressConsoleLog: boolean,
    leafletUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    mainTitle: string,
    cmsServerConfig:EnvironmentCmsServerConfig, 
    cmsTokenConfig: EnvironmentCmsTokenConfig,
    cmsViewConfig: EnvironmentCmsViewConfig,
    USERDATA_KEY: string,
    isMockEnabled: boolean,
    apiUrl: string,
    appThemeName: string,
    appPurchaseUrl: string,
    appHTMLIntegration: string,
    appPreviewUrl: string,
    appPreviewAngularUrl: string,
    appPreviewDocsUrl: string,
    appPreviewChangelogUrl: string,
}
export interface EnvironmentCmsServerConfig{
    configApiRetry: number,
    configApiServerPath: string,
    configHubServerPath: string,
    configFileServerPath: string,
    configQDocServerPath: string,
    configCompanyWebSite: string,
    modules: ['']
}
export interface EnvironmentCmsTokenConfig{
    SecurityKey: string,
    ClientMACAddress: string,
    osType: OperatingSystemTypeEnum,
    DeviceType: DeviceTypeEnum,
    PackageName: '',
}
export interface EnvironmentCmsViewConfig{
    mobileWindowInnerWidth: number,
    tableRowMouseEnter: boolean,
    enterAnimationDuration: string,
    exitAnimationDuration: string
}