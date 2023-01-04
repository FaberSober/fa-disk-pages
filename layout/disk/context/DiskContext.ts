import { createContext } from 'react';
import { Disk } from '@/types';

export interface DiskContextProps {
  bucket: Disk.StoreBucket;
  changeBucket: (bucketId: number) => void;
  renderCount: number;
  addRenderCount: () => void;
}

const DiskContext = createContext<DiskContextProps>({} as any);

export default DiskContext;
