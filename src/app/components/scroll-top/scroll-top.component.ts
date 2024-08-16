import { Component, HostListener, OnInit } from '@angular/core';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss']
})
export class ScrollTopComponent implements OnInit {
  constructor(public publicHelper: PublicHelper,
  ) {
    this.publicHelper.getStateOnChange().subscribe((value) => {
      if (value.themeStore.actionScrollTopPage)
        this.onScroll(null);
    });
  }
  viewScrollTop = false;
  verticalOffset = 0;
  ngOnInit(): void {

  }
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    this.verticalOffset = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;
    // console.log('verticalOffset', this.verticalOffset, 'windows.innerHeight', window.innerHeight);
    if (this.verticalOffset > (window.innerHeight / 5))
      this.viewScrollTop = true;
    else
      this.viewScrollTop = false;

    this.publicHelper.themeService.onActionScrollTopPage(false);
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: `smooth` });
  }

}
