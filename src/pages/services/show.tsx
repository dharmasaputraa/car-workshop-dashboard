import { DateField, DeleteButton, EditButton, ListButton, RefreshButton, Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Badge, Descriptions, Space } from "antd";

export const ServiceShow = () => {
  const {
    result: record,
    query: { isLoading },
  } = useShow();

  return (
    <Show
      isLoading={isLoading}
      headerButtons={
        <Space>
          <ListButton />
          <EditButton recordItemId={record?.id} />
          <DeleteButton recordItemId={record?.id} />
          <RefreshButton recordItemId={record?.id} />
        </Space>
      }
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{record?.name}</Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          {record?.description || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Base Price">
          {record?.base_price
            ? `IDR ${Number(record.base_price).toLocaleString("id-ID")}`
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Badge
            status={record?.is_active ? "success" : "error"}
            text={record?.is_active ? "Active" : "Inactive"}
          />
        </Descriptions.Item>
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
