import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { ROLE_OPTIONS } from "../../enums/roleType";

export const UserCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      include: "roles",
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values: Record<string, unknown>) => {
          formProps.onFinish?.({
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.password_confirmation,
            role: values.role,
          });
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Invalid email address" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item
          name="password_confirmation"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_: unknown, value: string) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!"),
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm password" />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Role is required" }]}
        >
          <Select
            placeholder="Select role"
            options={ROLE_OPTIONS.map((r) => ({
              label: r.label,
              value: r.value,
            }))}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};