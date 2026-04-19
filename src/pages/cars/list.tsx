import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Form, Input, Space, Table, Button } from "antd";

export const CarList = () => {
  const [form] = Form.useForm();
  const { tableProps, setFilters } = useTable({
    syncWithLocation: true,
    meta: {
      include: "owner",
    },
  });

  const handleSearch = () => {
    const values = form.getFieldsValue();
    const newFilters = [
      ...(values.plate_number
        ? [
            {
              field: "plate_number",
              operator: "contains" as const,
              value: values.plate_number,
            },
          ]
        : []),
      ...(values.brand
        ? [
            {
              field: "brand",
              operator: "contains" as const,
              value: values.brand,
            },
          ]
        : []),
      ...(values.owner_id
        ? [
            {
              field: "owner_id",
              operator: "eq" as const,
              value: values.owner_id,
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
          <Form.Item name="plate_number" noStyle>
            <Input.Search
              placeholder="Plate Number"
              allowClear
              onSearch={handleSearch}
              onPressEnter={handleSearch}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="brand" noStyle>
            <Input.Search
              placeholder="Brand"
              allowClear
              onSearch={handleSearch}
              onPressEnter={handleSearch}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="owner_id" noStyle>
            <Input.Search
              placeholder="Owner ID"
              allowClear
              onSearch={handleSearch}
              onPressEnter={handleSearch}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Button onClick={handleClear}>Clear</Button>
        </Space>
      </Form>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="plate_number" title={"Plate Number"} />
        <Table.Column dataIndex="brand" title={"Brand"} />
        <Table.Column dataIndex="model" title={"Model"} />
        <Table.Column dataIndex="year" title={"Year"} />
        <Table.Column dataIndex="color" title={"Color"} />
        <Table.Column
          dataIndex={["owner", "name"]}
          title={"Owner"}
          render={(value) => value || "-"}
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
