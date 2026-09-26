import { DiskContext } from '@/layout';
import { storeFileApi, storeTagApi } from '@/services';
import { Disk } from '@/types';
import { CommonModalProps, DragModal, Fa, FaUtils, TreeTransfer, useApiLoading } from '@fa/ui';
import { Button } from 'antd';
import { useContext, useState } from 'react';

export interface StoreDirModalProps extends CommonModalProps<Disk.StoreBucket> {
  fileIds: number[];
}

/**
 * STORE-文件打标签
 */
export default function StoreFileTagsModal({
  children,
  title,
  record,
  fetchFinish,
  addBtn,
  editBtn,
  onOpen,
  fileIds,
  ...props
}: StoreDirModalProps) {
  const { bucket } = useContext(DiskContext);

  const [open, setOpen] = useState(false);

  const [tagIds, setTagIds] = useState<string[]>([]);

  /** 提交表单 */
  function handleSubmit() {
    storeFileApi.addTags(fileIds, tagIds).then((res) => {
      FaUtils.showResponse(res, '打标签');
      if (res?.status === Fa.RES_CODE.OK) {
        setOpen(false);
        fetchFinish?.();
      }
    });
  }

  function showModal() {
    setOpen(true);
    if (onOpen) onOpen();
  }
  const onChange = (keys: string[]) => {
    setTagIds(keys);
  };

  const loading = useApiLoading([storeFileApi.getUrl('addTags')]);
  return (
    <span>
      <span onClick={showModal}>{children || <Button>打标签</Button>}</span>
      <DragModal
        title="打标签"
        open={open}
        onOk={handleSubmit}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={700}
        {...props}
      >
        <TreeTransfer
          serviceApi={{
            allTree: () => storeTagApi.getTree({ query: { bucketId: bucket.id } }),
          }}
          extraEffectArgs={[bucket]}
          targetKeys={tagIds}
          onChange={onChange}
        />
      </DragModal>
    </span>
  );
}
