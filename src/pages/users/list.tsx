import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import {
  Avatar,
  Badge,
  Button,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { getRoleColor, getRoleLabel } from "../../enums/roleType";
import { ToggleActiveButton } from "../../components/buttons";

export const UserList = () => {
  const [form] = Form.useForm();
  const { tableProps, setFilters } = useTable({
    syncWithLocation: true,
    meta: {
      include: "roles",
    },
  });

  const handleSearch = () => {
    const values = form.getFieldsValue();
    const newFilters = [
      ...(values.name
        ? [{ field: "name", operator: "contains" as const, value: values.name }]
        : []),
      ...(values.email
        ? [
            {
              field: "email",
              operator: "contains" as const,
              value: values.email,
            },
          ]
        : []),
      ...(values.is_active !== undefined && values.is_active !== null
        ? [
            {
              field: "is_active",
              operator: "eq" as const,
              value: values.is_active,
            },
          ]
        : []),
    ];
    setFilters(newFilters, "replace");
  };

  const handleClear = () => {
    form.resetFields();
    setFilters([], "replace");
  };

  return (
    <List>
      <Form form={form} style={{ marginBottom: 16 }}>
        <Space size="middle" wrap>
          <Form.Item name="name" noStyle>
            <Input.Search
              placeholder="Name"
              allowClear
              onSearch={handleSearch}
              onPressEnter={handleSearch}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item name="email" noStyle>
            <Input.Search
              placeholder="Email"
              allowClear
              onSearch={handleSearch}
              onPressEnter={handleSearch}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="is_active" noStyle>
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 130 }}
              onChange={handleSearch}
              options={[
                { label: "Active", value: true },
                { label: "Inactive", value: false },
              ]}
            />
          </Form.Item>
          <Button onClick={handleClear}>Clear</Button>
        </Space>
      </Form>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="avatar_url"
          title={"Avatar"}
          width={60}
          render={(value) => (
            <Avatar src={value} size="small" shape="circle" />
          )}
        />
        <Table.Column dataIndex="name" title={"Name"} />
        <Table.Column dataIndex="email" title={"Email"} />
        <Table.Column
          dataIndex="is_active"
          title={"Status"}
          render={(value) => (
            <Badge
              status={value ? "success" : "error"}
              text={value ? "Active" : "Inactive"}
            />
          )}
        />
        <Table.Column
          dataIndex="roles"
          title={"Role"}
          render={(roles: Array<{ name: string }>) => {
            if (!roles || roles.length === 0) return <Tag>-</Tag>;
            return roles.map((role, idx) => (
              <Tag key={idx} color={getRoleColor(role.name)}>
                {getRoleLabel(role.name)}
              </Tag>
            ));
          }}
        />
        <Table.Column
          dataIndex="created_at"
          title={"Created At"}
          render={(value: string) =>
            value ? (
              <DateField value={value} format="DD/MM/YYYY HH:mm:ss" />
            ) : (
              "-"
            )
          }
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <ToggleActiveButton
                recordItemId={String(record.id)}
                isActive={record.is_active}
                hideText
                size="small"
              />
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};