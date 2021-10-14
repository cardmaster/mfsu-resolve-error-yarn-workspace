import React from 'react';
import {Button} from 'antd';
import 'antd/dist/antd.css'
import {DownloadOutlined} from 'icon-bridge'
import { DownloadOutlined as AntDownload } from '@ant-design/icons';

export default function IndexPage() {
  return (
    <div>
      <Button icon={<DownloadOutlined />}>Download</Button>
      <Button icon={<AntDownload />}>Download ICON</Button>
    </div>
  );
}
