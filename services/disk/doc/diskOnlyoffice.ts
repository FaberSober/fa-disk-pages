import {BaseZeroApi, Fa} from "@fa/ui";
import {GATE_APP} from "@/configs";


class Api extends BaseZeroApi {

  /** 打开文件Token */
  openFile = (fileId: string): Promise<Fa.Ret<{ documentApi: string, fileModel: any }>> => this.get(`openFile/${fileId}`);

}

export default new Api(GATE_APP.disk.doc, 'onlyoffice');
