import { ThemeDirectionType, ThemeModeType } from "../services/theme.service";

export class ThemeStoreModel {
  dataMenu: string = '';
  themeMode: ThemeModeType = 'system';
  themeDirection: ThemeDirectionType = 'rtl';
  themeLanguage: string = 'fa';
  themeHighlight: string = '';
  innerWidth: number = 0;
  innerHeight: number = 0;
  mainPagePreloaderShow: boolean = true;
  actionScrollTopPage: boolean = false;
  actionScrollTopList: boolean = false;
}

