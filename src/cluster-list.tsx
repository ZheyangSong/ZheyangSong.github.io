import React, { FC } from "react";
import VirtualList from "rc-virtual-list";
import { List } from "antd";
import { useClusteredPCDLoader } from "./hooks";

export const ClusterList: FC<ReturnType<typeof useClusteredPCDLoader> & {onSelectCluster?: (cId: number) => void; onDeselectCluster?: () => void}> = ({
  clusters,
  onDeselectCluster = () => {},
  onSelectCluster = () => {},
}) => {
  const ContainerHeight = 600;

  return (
    <List>
      <VirtualList
        data={clusters}
        height={ContainerHeight}
        itemHeight={47}
        itemKey="cId"
      >
        {(item, idx) => (
          <List.Item onMouseEnter={() => onSelectCluster(idx)} onMouseLeave={() => onDeselectCluster()}>
            <List.Item.Meta title={`cluster ${idx + 1}`} />
            <div
              style={{
                height: "100%",
                overflowY: "scroll",
                whiteSpace: "break-spaces",
                overflowWrap: "break-word",
              }}
            >
              {item.pIndices.length}
            </div>
          </List.Item>
        )}
      </VirtualList>
    </List>
  );
};
