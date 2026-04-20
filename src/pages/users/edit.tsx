import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { ROLE_OPTIONS } from "../../enums/roleType";

export const UserEdit = () => {
  const { formProps, saveButtonProps, query } = useForm({
    meta: {
      include: "roles",
    },
  });

  const record = query?.data?.data as
    | Record<string, unknown>
    | undefined;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...formProps.initialValues,
          role: (record?.roles as Array<{ name: string }>)?.[0]?.name,
        }}
        onFinish={(values: Record<string, unknown>) => {
          const payload: Record<string, unknown> = {
            name: values.name,
            email: values.email,
            role: values.role,
          };

          // Only send password if user provided a new one
          if (values.password) {
            payload.password = values.password;
            payload.password_confirmation = values.password_confirmation;
          }

          formProps.onFinish?.(payload);
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
          label="New Password"
          rules={[
            ({ getFieldValue }) => ({
              validator(_: unknown, value: string) {
                if (!value || getFieldValue("password_confirmation")) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Please also confirm the new password"),
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Leave blank to keep current" />
        </Form.Item>
        <Form.Item
          name="password_confirmation"
          label="Confirm New Password"
          dependencies={["password"]}
          rules={[
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
          <Input.Password placeholder="Leave blank to keep current" />
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
    </Edit>
  );
};