import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch } from "antd";

export const ServiceEdit = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label={"Name"} name="name" rules={[{ required: true }]}>
          <Input placeholder="Service name" />
        </Form.Item>
        <Form.Item label={"Description"} name="description">
          <Input.TextArea
            rows={4}
            placeholder="Service description (optional)"
          />
        </Form.Item>
        <Form.Item
          label={"Base Price"}
          name="base_price"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
        </Form.Item>
        <Form.Item label={"Active"} name="is_active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
};
