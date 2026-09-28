import { FaUtils } from '@fa/ui';
import FaIconPro from '@features/fa-admin-pages/components/icons/FaIconPro';
import { CSSProperties, useEffect, useState } from 'react';
import { storeFileApi } from '@/services';
import { Disk } from '@/types';

export interface FileIconProps {
  file: Disk.StoreFile;
  width: number;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2022/12/29 13:58
 */
export default function FileIcon({ file, width = 20, style }: FileIconProps) {
  const [preview, setPreview] = useState<{ id: number; url: string }>();
  const previewUrl = preview?.id === file.id ? preview.url : undefined;
  const isImg = !file.dir && FaUtils.isImg(file.type);

  useEffect(() => {
    let active = true;
    if (isImg) {
      storeFileApi
        .createAccessResource(file.id)
        .then((res) => {
          if (active && res.data?.previewUrl) setPreview({ id: file.id, url: res.data.previewUrl });
        })
        .catch(() => undefined);
    }
    return () => {
      active = false;
    };
  }, [file.id, isImg]);

  const divStyle = {
    width,
    height: width,
    ...style,
  };

  if (file.dir) {
    return (
      <div style={divStyle}>
        <FaIconPro icon="fa-solid fa-folder" style={{ width, height: width }} />
      </div>
    );
  }

  if (isImg && previewUrl) {
    return (
      <div className="fa-flex-row fa-flex-center" style={divStyle}>
        <img src={previewUrl} style={{ maxWidth: width, maxHeight: width }} alt={file.name} />
      </div>
    );
  }

  return (
    <div style={divStyle}>
      <FaIconPro icon="fa-solid fa-file-lines" style={{ width, height: width }} />
    </div>
  );
}
