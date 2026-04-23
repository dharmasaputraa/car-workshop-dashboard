import { Edit } from "@refinedev/antd";
import { useOne } from "@refinedev/core";
import { Form, Select, Button, message } from "antd";
import { useState } from "react";
import { useParams } from "react-router";
import { axiosInstance } from "../../providers/data";
import { ROLE_OPTIONS } from "../../enums/roleType";

export const UserChangeRole = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { query } = useOne({
    resource: "users",
    id: id || "",
    queryOptions: {
      enabled: !!id,
    },
    meta: {
      include: "roles",
    },
  });

  const record = query?.data?.data as Record<string, unknown> | undefined;
  const isLoading = query?.isLoading || false;
  const currentRole = (record?.roles as Array<{ name: string }>)?.[0]?.name;

  const handleSubmit = async (values: { role: string }) => {
    if (!id) return;

    setLoading(true);
    try {
      await axiosInstance.patch(`/users/${id}/role?include=roles`, {
        role: values.role,
      });
      message.success("Role changed successfully");
    } catch (error) {
      message.error("Failed to change role");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Edit
      title="Change User Role"
      canDelete={false}
      saveButtonProps={{ style: { display: "none" } }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ role: currentRole }}
        onFinish={handleSubmit}
      >
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
            loading={isLoading}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Change Role
          </Button>
        </Form.Item>
      </Form>
    </Edit>
  );
};
