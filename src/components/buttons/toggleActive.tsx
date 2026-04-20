import React from "react";
import { Button, Popconfirm } from "antd";
import type { ButtonProps } from "antd";
import {
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useCan, useInvalidate } from "@refinedev/core";
import { axiosInstance } from "../../providers/data";
import { message } from "antd";

export interface ToggleActiveButtonProps {
  resource?: string;
  recordItemId?: string;
  isActive?: boolean | null;
  hideText?: boolean;
  children?: React.ReactNode;
  successMessage?: string;
  errorMessage?: string;
}

export const ToggleActiveButton: React.FC<
  ToggleActiveButtonProps & ButtonProps
> = ({
  resource = "users",
  recordItemId,
  isActive,
  hideText = false,
  children,
  successMessage = "User status toggled successfully",
  errorMessage = "Failed to toggle user status",
  ...rest
}) => {
  const invalidate = useInvalidate();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: canToggle } = useCan({
    resource,
    action: "toggle_active",
  });

  if (!canToggle?.can) return null;

  const handleToggle = async () => {
    if (!recordItemId) return;
    try {
      await axiosInstance.patch(
        `/${resource}/${recordItemId}/toggle-active?include=roles`,
      );
      messageApi.success(successMessage);
      invalidate({
        resource,
        id: recordItemId,
        invalidates: ["list", "detail"],
      });
    } catch {
      messageApi.error(errorMessage);
    }
  };

  const active = isActive ?? true;
  const label = active ? "Deactivate" : "Activate";

  return (
    <>
      {contextHolder}
      <Popconfirm
        title={active ? "Deactivate this user?" : "Activate this user?"}
        description={
          active
            ? "This user will be deactivated and won't be able to access the system."
            : "This user will be activated and able to access the system."
        }
        onConfirm={handleToggle}
        okText="Yes"
        cancelText="No"
      >
        <Button
          icon={active ? <StopOutlined /> : <CheckCircleOutlined />}
          title={label}
          {...rest}
        >
          {!hideText && (children ?? label)}
        </Button>
      </Popconfirm>
    </>
  );
};