import React, { FC, useMemo } from "react";
import VirtualList from "rc-virtual-list";
import { List } from "antd";
import { useClusteredPCDLoader } from "./hooks";

export const ClusterList: FC<
  ReturnType<typeof useClusteredPCDLoader>['clusteredResult'] & {
    onSelectCluster?: (cId: number) => void;
    onDeselectCluster?: () => void;
  }
> = ({
  clusters,
  onDeselectCluster = () => {},
  onSelectCluster = () => {},
}) => {
  const ContainerHeight = 600;
  const sortedList = useMemo(
    () => clusters.sort((a, b) => b.pIndices.length - a.pIndices.length),
    [clusters]
  );

  return (
    <List>
      <VirtualList
        data={sortedList}
        height={ContainerHeight}
        itemHeight={47}
        itemKey="cId"
      >
        {(item) => (
          <List.Item
            onMouseEnter={() => onSelectCluster(item.cId)}
            onMouseLeave={() => onDeselectCluster()}
          >
            <List.Item.Meta title={`cluster ${item.cId}`} />
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
