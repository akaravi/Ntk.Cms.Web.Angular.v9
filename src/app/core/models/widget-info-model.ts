export class WidgetInfoModel {
  title = '';
  description = '';
  link = '';
  //items: WidgetContentInfoModel[];
  items = new Map<string, WidgetContentInfoModel>();
  setItem(model: WidgetContentInfoModel) {
    if (!this.items)
      this.items = new Map<string, WidgetContentInfoModel>();// [];
    if (this.items.size == 0) {
      this.items.set(model.key, model);
      return;
    }
    //var findIndex = false;
    // for (let index = 0; index < this.items.size; index++) {
    //   if (this.items[index].key == model.key) {
    //     this.items[index] = model;
    //     findIndex = true;
    //     return
    //   }
    // }
    //if (!findIndex)
    this.items.set(model.key, model);
  }
}
export class WidgetContentInfoModel {
  constructor(_key: string, _index: number, _count: number, _lint = '', _color = '', _description: string='') {
    this.key = _key;
    this.index = _index;
    this.count = _count;
    this.description = _description;
    this.link = _lint;
    this.color = _color;
  }

  key = '';
  index = 0;
  count = 0;
  description = '';
  link = '';
  color = '';
}
