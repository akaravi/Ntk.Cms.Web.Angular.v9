import { Component, OnInit } from '@angular/core';
import { TokenInfoModel } from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';

@Component({
  selector: 'app-file-content-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class FileContentExplorerComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor(public publicHelper: PublicHelper, private tokenHelper: TokenHelper) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      this.language = this.tokenInfo.language;
    });
  }
  tokenInfo = new TokenInfoModel();
  language = 'en';
  fileManagerOpenForm = true;
  fileManagerTree: TreeModel;
  selectFileType = [];
  ngOnInit(): void {
  }
}
