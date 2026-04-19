import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Badge, Form, Input, Select, Space, Table, Button } from "antd";

export const ServiceList = () => {
  const [form] = Form.useForm();
  const { tableProps, setFilters } = useTable({
    syncWithLocation: true,
  });

  const handleSearch = () => {
    const values = form.getFieldsValue();
    const newFilters = [
      ...(values.name
        ? [{ field: "name", operator: "contains" as const, value: values.name }]
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
              placeholder="Service Name"
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
              style={{ width: 150 }}
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
        <Table.Column dataIndex="name" title={"Name"} />
        <Table.Column
          dataIndex="description"
          title={"Description"}
          render={(value) => value || "-"}
        />
        <Table.Column
          dataIndex="base_price"
          title={"Base Price"}
          render={(value) =>
            value ? `IDR ${Number(value).toLocaleString("id-ID")}` : "-"
          }
        />
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
          dataIndex="created_at"
          title={"Created At"}
          render={(value: string) =>
            value ? <DateField value={value} format="DD/MM/YYYY HH:mm:ss" /> : "-"
          }
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
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
