import { DateField, DeleteButton, EditButton, ListButton, RefreshButton, Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import {  Descriptions, Space } from "antd";


export const CarShow = () => {
  const {
    result: record,
    query: { isLoading },
  } = useShow({
    meta: {
      include: "owner",
    },
  });

  return (
    <Show isLoading={isLoading}
     headerButtons={
        <Space>
          <ListButton />
          <EditButton recordItemId={record?.id} />
          <DeleteButton recordItemId={record?.id} />
          <RefreshButton recordItemId={record?.id} />
        </Space>
      }>
        <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Plate Number">{record?.plate_number}</Descriptions.Item>
        <Descriptions.Item label="Brand">{record?.brand}</Descriptions.Item>
        <Descriptions.Item label="Model">{record?.model}</Descriptions.Item>
        <Descriptions.Item label="Year">{record?.year}</Descriptions.Item>
        <Descriptions.Item label="Color">{record?.color}</Descriptions.Item>
        <Descriptions.Item label="Owner">{record?.owner?.name}</Descriptions.Item>
        <Descriptions.Item label="Owner Email">{record?.owner?.email}</Descriptions.Item>
        <Descriptions.Item label="Created At">
          <DateField value={record?.created_at} format="DD/MM/YYYY HH:mm:ss" />
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          <DateField value={record?.updated_at} format="DD/MM/YYYY HH:mm:ss" />
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
