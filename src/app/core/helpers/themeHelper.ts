
type Mode = 'light' | 'dark' | 'system'

export class ThemeHelper {
  public getSystemMode = (): Mode => {
    return window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light'
  }
}
