import React, { useState } from 'react';
import { Disk } from "@/types";
import { isNil, trim } from "lodash";
import { Drawer, Dropdown, Space, Table, TableProps, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { FaHref, FaUtils } from "@fa/ui";
import { EllipsisOutlined } from "@ant-design/icons";
import { storeFileTagApi } from "@/services";
import { FileIcon } from "@/components";
import StoreDirModal from "../modal/StoreDirModal";
import FileSaveDetail from "./FileSaveDetail";


export interface FileTableProps extends Omit<TableProps<Disk.StoreFile>, 'columns'> {
  dirId: number;
  onRefresh: () => void;
  onIntoDir: (dirId:number) => void;
  showPath?: boolean;
}

/**
 * @author xu.pengfei
 * @date 2022/12/29 14:09
 */
export default function FileTable({ dirId, onRefresh, onIntoDir, showPath, ...props }: FileTableProps) {
  const [viewItem, setViewItem] = useState<Disk.StoreFile>();


  function handleRemoveTagLink(linkId: number) {
    storeFileTagApi.remove(linkId).then(res => {
      FaUtils.showResponse(res, '删除标签')
      onRefresh()
    })
  }

  function handleViewFile(i: Disk.StoreFile) {
    if (!i.dir) {
      setViewItem(i)
    }
  }

  const columns = [
    {
      dataIndex: 'name',
      title: '文件名',
      sorter: true,
      render: (_, r: Disk.StoreFile) => {
        return (
          <div className="fa-flex-row-center">
            <a
              className="fa-flex-row-center"
              style={{color: '#333'}}
              onClick={() => {
                if (r.dir) {
                  onIntoDir(r.id)
                }
              }}
            >
              <FileIcon file={r} width={30} style={{marginRight: 6}} />
              <div className="fa-disk-list-item-name" onClick={() => handleViewFile(r)}>
                <div>{r.name}</div>
                {showPath && <div style={{fontSize: '6px', color: '#999'}}>{trim(r.fullPath).split(",").map(i => i.replaceAll('#', '')).join('/')}</div>}
              </div>
            </a>
          </div>
        );
      },
    },
    {
      dataIndex: 'tags',
      title: '标签',
      width: 300,
      render: (_, record) => {
        if (isNil(record.tags)) return null;
        return (
          <div className="fa-flex-row-center">
            {record.tags.map(i => (
              <Tag
                key={i.id}
                color={i.color}
                closable
                onClose={() => handleRemoveTagLink(i.id)}
              >{i.name}</Tag>
            ))}
          </div>
        );
      },
    },
    {
      dataIndex: 'size',
      title: '大小',
      width: 100,
      sorter: true,
      render: (_, record) => {
        if (record.dir) {
          return `${record.size}项`
        }
        return FaUtils.sizeToHuman(record.size);
      },
    },
    {dataIndex: 'crtName', title: '创建者', width: 100},
    {
      dataIndex: 'crtTime',
      title: '更新时间',
      width: 160,
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'menu',
      render: (_, r: Disk.StoreFile) => {
        const items = [
          {
            key: '1',
            label: (
              <StoreDirModal record={r} dirId={dirId} title="重命名" fetchFinish={onRefresh}>
                <a>
                  <div>重命名</div>
                </a>
              </StoreDirModal>
            ),
          },
          // {
          //   key: '4',
          //   danger: true,
          //   label: '删除',
          // },
        ];
        return (
          <Space>
            <Dropdown menu={{items}} trigger={['click']}>
              <FaHref icon={<EllipsisOutlined/>} text="更多"/>
            </Dropdown>
            {/*<AuthDelBtn handleDelete={() => handleDeleteItem(r)} />*/}
          </Space>
        )
      },
      width: 80,
      fixed: 'right',
    },
  ] as ColumnsType<Disk.StoreFile>

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        pagination={false}
        size="small"
        {...props}
      />

      <Drawer title="查看文件详情" width={600} open={viewItem != undefined} onClose={() => setViewItem(undefined)}>
        {viewItem && <FileSaveDetail id={viewItem.id} />}
      </Drawer>
    </>
  )
}