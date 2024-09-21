import { ThemeDirectionType, ThemeModeType } from "../services/theme.service";

export class ThemeStoreModel {
  dataMenu: string = '';
  themeMode: ThemeModeType = 'system';
  themeDirection: ThemeDirectionType = 'rtl';
  themeFontSize: number = 0;
  themeLanguage: string = 'fa';
  themeHighlight: string = 'blue';
  themeMenuPin:number[]=[];
  innerWidth: number = 0;
  innerHeight: number = 0;
  mainPagePreloaderShow: boolean = true;
  actionScrollTopPage: boolean = false;
  actionScrollTopList: boolean = false;
}

