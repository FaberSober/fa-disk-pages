import React, { useEffect, useState } from 'react';
import { Disk } from "@/types";
import { FaUtils, PageLoading } from "@fa/ui";
import { storeFileApi } from "@/services";
import { Descriptions, Image, Input, QRCode } from "antd";
import FileSaveHisTable from "@features/fa-disk-pages/pages/admin/disk/store/alls/cube/FileSaveHisTable";


export interface FileSaveDetailProps {
  id: number;
}

/**
 * @author xu.pengfei
 * @date 2023/2/7 14:39
 */
export default function FileSaveDetail({id}: FileSaveDetailProps) {
  const [data, setData] = useState<Disk.StoreFile>();
  const [previewUrl, setPreviewUrl] = useState<string>();

  useEffect(() => {
    let active = true;
    storeFileApi.getById(id).then(res => {
      if (!active) return;
      setData(res.data)
      if (res.data && FaUtils.isImg(res.data.type)) {
        storeFileApi.createAccessResource(res.data.id).then(access => {
          if (active) setPreviewUrl(access.data?.previewUrl);
        });
      }
    })
    return () => { active = false; };
  }, [id])

  function handleSubmitInfo(e:any) {
    if (data == undefined) return
    if (data.info === e.target.value) return;

    data.info = e.target.value
    storeFileApi.updateInfo(data.id, {info: data.info}).then(res => {
      FaUtils.showResponse(res, "更新文件备注")
    })
  }

  if (data == undefined) return <PageLoading />

  return (
    <Descriptions bordered column={1} labelStyle={{ width: 120 }}>
      <Descriptions.Item label="名称">{data.name}</Descriptions.Item>
      <Descriptions.Item label="文件备注">
        <Input.TextArea
          className="fa-input-underline"
          defaultValue={data.info}
          onBlur={handleSubmitInfo}
          autoSize
          maxLength={255}
        />
      </Descriptions.Item>
      <Descriptions.Item label="创建人">{data.crtName}</Descriptions.Item>
      <Descriptions.Item label="创建时间">{data.crtTime}</Descriptions.Item>
      {FaUtils.isImg(data.type) && (
        <Descriptions.Item label="缩略图">
          {previewUrl && (
            <Image
              width={80}
              src={previewUrl}
              preview={{
                src: previewUrl,
              }}
            />
          )}
        </Descriptions.Item>
      )}
      <Descriptions.Item label="二维码">
        <QRCode value={`f/${data.id}`} />
      </Descriptions.Item>
      <Descriptions.Item label="历史版本">
        <FileSaveHisTable storeFileId={data.id} />
      </Descriptions.Item>

    </Descriptions>
  )
}
