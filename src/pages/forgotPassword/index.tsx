import { AuthPage } from "@refinedev/antd";
import { CustomTitle } from "../../components/title";

export const ForgotPassword = () => {
  return <AuthPage type="forgotPassword" title={<CustomTitle />} />;
};