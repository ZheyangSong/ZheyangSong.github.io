import React, { FC } from 'react';
import { Select } from 'antd';

export const DataChooser: FC<{onSelectDataSrc: (val: string) => void, dataSrcs: { key: string; value: string }[]}> = ({onSelectDataSrc, dataSrcs}) => (
  <Select
    showSearch
    placeholder="Select a pcd file"
    optionFilterProp="children"
    onChange={onSelectDataSrc}
    filterOption={(input, option) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    }
    options={dataSrcs.map(({key, value}) => ({ value, label: `pcd-${key}`}))}
  />
);
