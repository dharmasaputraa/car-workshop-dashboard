import type { RefineThemedLayoutHeaderProps } from "@refinedev/antd";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import {
  Layout as AntdLayout,
  Avatar,
  Dropdown,
  Space,
  Switch,
  theme,
  Typography,
} from "antd";
import React, { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  role: string;
};

export const Header: React.FC<RefineThemedLayoutHeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);
  const { mutate: logout } = useLogout();

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        <Dropdown
          menu={{
            items: [
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "Logout",
                danger: true,
                style: { minWidth: 150 },
                onClick: () => logout(),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Space style={{ marginLeft: "8px", cursor: "pointer" }} size="middle">
            {user?.name && <Text strong>{user.name}</Text>}
            {user?.avatar_url ? (
              <Avatar src={user?.avatar_url} alt={user?.name} />
            ) : (
              <Avatar icon={<UserOutlined />} />
            )}
          </Space>
        </Dropdown>
      </Space>
    </AntdLayout.Header>
  );
};
