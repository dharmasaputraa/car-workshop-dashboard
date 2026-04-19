import { Typography } from "antd";

export const CustomTitle = ({ collapsed = false }: { collapsed?: boolean }) => {
  return (
    <Typography.Title
      level={1}
      style={{
        margin: 0,
        fontSize: collapsed ? "14px" : "16px",
        textAlign: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {collapsed ? "CW" : "Car Workshop"}
    </Typography.Title>
  );
};