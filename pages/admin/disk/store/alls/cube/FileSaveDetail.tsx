import React, { useEffect, useState } from 'react';
import { Disk } from "@/types";
import { FaUtils, PageLoading } from "@fa/ui";
import { fileSaveApi, storeFileApi } from "@/services";
import { Descriptions, Image, QRCode } from "antd";


export interface FileSaveDetailProps {
  id: number;
}

/**
 * @author xu.pengfei
 * @date 2023/2/7 14:39
 */
export default function FileSaveDetail({id}: FileSaveDetailProps) {
  const [data, setData] = useState<Disk.StoreFile>();

  useEffect(() => {
    storeFileApi.getById(id).then(res => {
      setData(res.data)
    })
  }, [id])

  if (data == undefined) return <PageLoading />

  return (
    <Descriptions bordered column={1} labelStyle={{ width: 120 }}>
      <Descriptions.Item label="名称">{data.name}</Descriptions.Item>
      <Descriptions.Item label="创建人">{data.crtName}</Descriptions.Item>
      <Descriptions.Item label="创建时间">{data.crtTime}</Descriptions.Item>
      {FaUtils.isImg(data.type) && (
        <Descriptions.Item label="缩略图">
          <Image
            width={80}
            src={fileSaveApi.genLocalGetFilePreview(data.fileId)}
            preview={{
              src: fileSaveApi.genLocalGetFile(data.fileId),
            }}
          />
        </Descriptions.Item>
      )}
      <Descriptions.Item label="二维码">
        <QRCode value={`f/${data.id}`} />
      </Descriptions.Item>

    </Descriptions>
  )
}