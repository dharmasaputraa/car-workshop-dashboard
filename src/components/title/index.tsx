import React from "react";
import { Typography } from "antd";

const appTitle = import.meta.env.VITE_APP_TITLE || "Car Workshop";

export const CustomTitle = ({ collapsed = false }: { collapsed?: boolean }) => {
  const shortTitle = appTitle
    .split(" ")
    .map((w: string) => w[0])
    .join("");

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
      {collapsed ? shortTitle : appTitle}
    </Typography.Title>
  );
};