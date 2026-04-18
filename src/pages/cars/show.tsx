import { DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const CarShow = () => {
  const {
    result: record,
    query: { isLoading },
  } = useShow({
    meta: {
      include: "owner",
    },
  });

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />
      <Title level={5}>{"Plate Number"}</Title>
      <TextField value={record?.plate_number} />
      <Title level={5}>{"Brand"}</Title>
      <TextField value={record?.brand} />
      <Title level={5}>{"Model"}</Title>
      <TextField value={record?.model} />
      <Title level={5}>{"Year"}</Title>
      <TextField value={record?.year} />
      <Title level={5}>{"Color"}</Title>
      <TextField value={record?.color} />
      <Title level={5}>{"Owner"}</Title>
      <TextField value={record?.owner?.name} />
      <Title level={5}>{"Owner Email"}</Title>
      <TextField value={record?.owner?.email} />
      <Title level={5}>{"Created At"}</Title>
      {record?.created_at && <DateField value={record?.created_at} />}
      <Title level={5}>{"Updated At"}</Title>
      {record?.updated_at && <DateField value={record?.updated_at} />}
    </Show>
  );
};
