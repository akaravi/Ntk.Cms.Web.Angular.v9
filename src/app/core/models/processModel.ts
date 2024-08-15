import { ProcessInfoModel } from "ntk-cms-api";

export class ProcessModel {
    inRunAll = false;
    inRunArea: boolean[] = [];
    infoArea: Map<string, ProcessInfoModel>[] = [];
    infoAll = new Map<string, ProcessInfoModel>();
}
