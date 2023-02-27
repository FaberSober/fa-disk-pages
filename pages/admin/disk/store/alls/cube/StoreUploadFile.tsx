import React, { useContext, useRef } from 'react';
import { FaUtils } from "@fa/ui";
import { fileSaveApi, storeFileApi } from "@/services";
import { DiskContext } from "@/layout";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';
import { UploadFileProps } from "@features/fa-disk-pages/layout/disk/context/DiskContext";


export interface StoreUploadFileProps {
  dirId: number;
  onSuccess?: () => void;
}

/**
 * @author xu.pengfei
 * @date 2022/12/26 14:21
 */
export default function StoreUploadFile({dirId, onSuccess}: StoreUploadFileProps) {
  const inputRef = useRef<any>(null);

  const { bucket, fireUploadFile } = useContext(DiskContext);

  function handleInputFileChange(e: any) {
    const file = e.target.files[0];
    // console.log('file', file)
    uploadOneFile(file)
  }

  function uploadOneFile(file:any) {
    const id = uuidv4();
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      // 走自己服务器上传，会占据自己服务器带宽
      fileSaveApi
        .uploadFile(file, (pe) => {
          console.log('progressEvent', pe);
          const fileInfo:UploadFileProps = {
            id,
            fileName: file.name,
            total: pe.total,
            loaded: pe.loaded || 0,
            progress: pe.progress || 0,
            rate: pe.rate || 0,
            status: pe.progress === 1 ? 'success' : 'uploading',
          }
          console.log('fileInfo', fileInfo)
          fireUploadFile(fileInfo)
        })
        .then((res) => {
          // save file
          const params = {
            bucketId: bucket.id,
            parentId: dirId,
            fileId: res.data.id,
            dir: false,
            tags: [],
          }
          storeFileApi.save(params).then((res) => {
            FaUtils.showResponse(res, '上传文件');
            if (onSuccess) onSuccess();
          });

          // TODO update progress to layout
          // cb(res.data.localUrl, { title: file.name });
        });
    });
    reader.readAsDataURL(file);
  }

  function triggerClick() {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" onChange={handleInputFileChange} style={{display: 'none'}} />
      <Button type="primary" icon={<UploadOutlined />} onClick={triggerClick}>上传文件</Button>
    </div>
  )
}