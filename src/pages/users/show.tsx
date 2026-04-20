import {
  DateField,
  DeleteButton,
  EditButton,
  ListButton,
  RefreshButton,
  Show,
} from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import {
  Avatar,
  Badge,
  Descriptions,
  Space,
  Tag,
} from "antd";
import { getRoleColor, getRoleLabel } from "../../enums/roleType";
import { ToggleActiveButton } from "../../components/buttons";

export const UserShow = () => {
  const {
    result: record,
    query: { isLoading },
  } = useShow({
    meta: {
      include: "roles",
    },
  });

  return (
    <Show
      isLoading={isLoading}
      headerButtons={
        <Space>
          <ToggleActiveButton
            recordItemId={String(record?.id)}
            isActive={record?.is_active}
          />
          <ListButton />
          <EditButton recordItemId={record?.id} />
          <DeleteButton recordItemId={record?.id} />
          <RefreshButton recordItemId={record?.id} />
        </Space>
      }
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Avatar">
          <Avatar src={record?.avatar_url} size={64} shape="circle" />
        </Descriptions.Item>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{record?.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{record?.email}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Badge
            status={record?.is_active ? "success" : "error"}
            text={record?.is_active ? "Active" : "Inactive"}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Email Verified At">
          {record?.email_verified_at ? (
            <DateField
              value={record.email_verified_at}
              format="DD/MM/YYYY HH:mm:ss"
            />
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Roles">
          {record?.roles && record.roles.length > 0
            ? record.roles.map(
                (role: { name: string }, idx: number) => (
                  <Tag key={idx} color={getRoleColor(role.name)}>
                    {getRoleLabel(role.name)}
                  </Tag>
                ),
              )
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          <DateField
            value={record?.created_at}
            format="DD/MM/YYYY HH:mm:ss"
          />
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          <DateField
            value={record?.updated_at}
            format="DD/MM/YYYY HH:mm:ss"
          />
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};