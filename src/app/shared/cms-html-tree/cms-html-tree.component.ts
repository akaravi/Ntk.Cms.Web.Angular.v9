import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-cms-html-tree',
    templateUrl: './cms-html-tree.component.html',
    standalone: false
})
export class CmsHtmlTreeComponent implements OnInit {
  static nextId = 0;
  id = ++CmsHtmlTreeComponent.nextId;
  @Input() optionHeaderDisplay = true;
  @Input() optionActionMainDisplay = true;
  @Input() optionFooterDisplay = true;

  constructor() { }
  ngOnInit(): void {

  }
}

