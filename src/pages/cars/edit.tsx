import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, Select } from "antd";

export const CarEdit = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      include: "owner",
    },
  });

  const { selectProps: ownerSelectProps } = useSelect({
    resource: "users",
    optionLabel: "name",
    optionValue: "id",
    pagination: {
      mode: "off",
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label={"Owner"} name="owner_id" rules={[{ required: true }]}>
          <Select
            {...ownerSelectProps}
            placeholder="Select owner"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item
          label={"Plate Number"}
          name="plate_number"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={"Brand"} name="brand" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label={"Model"} name="model" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label={"Year"} name="year" rules={[{ required: true }]}>
          <InputNumber min={1900} max={2100} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label={"Color"} name="color" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
