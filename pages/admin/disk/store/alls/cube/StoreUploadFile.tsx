import { UploadOutlined } from '@ant-design/icons';
import { Fa, FaUtils } from '@fa/ui';
import { UploadFileProps } from '@features/fa-disk-pages/layout/disk/context/DiskContext';
import { Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useContext, useRef } from 'react';
import { DiskContext } from '@/layout';
import { storeFileApi } from '@/services';

export interface StoreUploadFileProps {
  dirId: number;
  onSuccess?: () => void;
}

/**
 * @author xu.pengfei
 * @date 2022/12/26 14:21
 */
export default function StoreUploadFile({ dirId, onSuccess }: StoreUploadFileProps) {
  const inputRef = useRef<any>(null);

  const { bucket, fireUploadFile } = useContext(DiskContext);

  function handleInputFileChange(e: any) {
    const files = Array.from(e.target.files || []) as File[];
    e.target.value = '';
    void uploadFiles(files);
  }

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return;

    let uploaded = false;
    for (const file of files) {
      uploaded = (await uploadOneFile(file)) || uploaded;
    }
    if (uploaded) onSuccess?.();
  }

  async function uploadOneFile(file: File) {
    const id = uuidv4();
    let loaded = 0;
    let progress = 0;
    let rate = 0;
    const update = (status: UploadFileProps['status'], error?: string, fileName = file.name) => {
      fireUploadFile({ id, fileName, total: file.size, loaded, progress, rate, status, error });
    };

    update('uploading');
    try {
      const res = await storeFileApi.upload(file, bucket.id, dirId, (pe) => {
        loaded = pe.loaded || loaded;
        progress = pe.progress || (pe.total ? loaded / pe.total : progress);
        rate = pe.rate || rate;
        update('uploading');
      });
      if (res.status !== Fa.RES_CODE.OK || !res.data) {
        FaUtils.showResponse(res, '上传文件');
        throw new Error(res.message || '上传文件失败');
      }
      loaded = file.size;
      progress = 1;
      update('success', undefined, res.data.name || file.name);
      FaUtils.showResponse(res, '上传文件');
      return true;
    } catch (e: any) {
      update('error', e?.response?.data?.message || e?.message || '上传文件失败');
      return false;
    }
  }

  function triggerClick() {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }

  return (
    <div>
      <input ref={inputRef} multiple type="file" onChange={handleInputFileChange} style={{ display: 'none' }} />
      <Button type="primary" icon={<UploadOutlined />} onClick={triggerClick}>上传文件</Button>
    </div>
  )
}
