import { BaseApi } from '@fa/ui';
import { GATE_APP } from '@/configs';
import { Disk } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseApi<Disk.StoreFileHis, number> {}

export default new Api(GATE_APP.disk.store, 'storeFileHis');
