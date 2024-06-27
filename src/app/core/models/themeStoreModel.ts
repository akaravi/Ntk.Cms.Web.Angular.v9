import { ThemeModeType } from "../services/theme.service";

export class ThemeStoreModel {
  dataMenu: string = '';
  themeMode: ThemeModeType = 'system';
  highlight: string = '';
  innerWidth: number = 0;
  innerHeight: number = 0;
  mainPagePreloaderShow: boolean = true;
  actionScrollTopPage: boolean = false;
  actionScrollTopList: boolean = false;
}

