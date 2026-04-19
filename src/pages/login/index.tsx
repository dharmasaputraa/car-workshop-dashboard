import { AuthPage } from "@refinedev/antd";
import { CustomTitle } from "../../components/title";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={<CustomTitle />}
      formProps={{
        initialValues: { email: "admin@example.com", password: "password" },
      }}
    />
  );
};