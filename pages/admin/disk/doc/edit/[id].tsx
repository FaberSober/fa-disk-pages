import React from 'react';
import { useParams } from 'react-router-dom'
import { DiskOnlyofficeEditor } from "@features/fa-disk-pages/components";


export interface DocEditProps {
}

/**
 * @author xu.pengfei
 * @date 2023/3/14 15:52
 */
export default function DocEdit({}: DocEditProps) {
  const { id } = useParams()

  return (
    <div className="fa-full-content">
      {id && <DiskOnlyofficeEditor storeFileId={id} />}
    </div>
  )
}