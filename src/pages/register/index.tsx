import React from "react";
import { useRegister, useTranslate } from "@refinedev/core";
import {
  Row,
  Col,
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  theme,
} from "antd";
import { CustomTitle } from "../../components/title";
const layoutStyles: React.CSSProperties = {};

const containerStyles: React.CSSProperties = {
  maxWidth: "400px",
  margin: "auto",
  padding: "32px",
  boxShadow:
    "0px 2px 4px rgba(0, 0, 0, 0.02), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 1px 2px rgba(0, 0, 0, 0.03)",
};

const headStyles: React.CSSProperties = {
  borderBottom: 0,
  padding: 0,
};

const bodyStyles: React.CSSProperties = { padding: 0, marginTop: "32px" };

const titleStyles: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 0,
  fontSize: "24px",
  lineHeight: "32px",
  fontWeight: 700,
  overflowWrap: "break-word",
  hyphens: "manual",
  textOverflow: "unset",
  whiteSpace: "pre-wrap",
};

export const Register = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const translate = useTranslate();
  const { mutate: register, isPending } = useRegister();

  const PageTitle = (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "32px",
      }}
    >
      <CustomTitle />
    </div>
  );

  const CardTitle = (
    <Typography.Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        ...titleStyles,
      }}
    >
      {translate("pages.register.title", "Sign up for your account")}
    </Typography.Title>
  );

  return (
    <Layout style={layoutStyles}>
      <Row
        justify="center"
        align="middle"
        style={{
          padding: "16px 0",
          minHeight: "100dvh",
        }}
      >
        <Col xs={22}>
          {PageTitle}
          <Card
            title={CardTitle}
            styles={{
              header: headStyles,
              body: bodyStyles,
            }}
            style={{
              ...containerStyles,
              backgroundColor: token.colorBgElevated,
            }}
          >
            <Form
              layout="vertical"
              form={form}
              onFinish={(values) => register(values)}
              requiredMark={false}
            >
              <Form.Item
                name="name"
                label={translate("pages.register.fields.name", "Name")}
                rules={[
                  {
                    required: true,
                    message: translate(
                      "pages.register.errors.requiredName",
                      "Name is required",
                    ),
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder={translate(
                    "pages.register.fields.name",
                    "Name",
                  )}
                />
              </Form.Item>
              <Form.Item
                name="email"
                label={translate("pages.register.email", "Email")}
                rules={[
                  {
                    required: true,
                    message: translate(
                      "pages.register.errors.requiredEmail",
                      "Email is required",
                    ),
                  },
                  {
                    type: "email",
                    message: translate(
                      "pages.register.errors.validEmail",
                      "Invalid email address",
                    ),
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder={translate(
                    "pages.register.fields.email",
                    "Email",
                  )}
                />
              </Form.Item>
              <Form.Item
                name="password"
                label={translate("pages.register.fields.password", "Password")}
                rules={[
                  {
                    required: true,
                    message: translate(
                      "pages.register.errors.requiredPassword",
                      "Password is required",
                    ),
                  },
                ]}
              >
                <Input type="password" placeholder="●●●●●●●●" size="large" />
              </Form.Item>
              <Form.Item
                name="password_confirmation"
                label={translate(
                  "pages.register.fields.passwordConfirmation",
                  "Confirm Password",
                )}
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: translate(
                      "pages.register.errors.requiredPasswordConfirmation",
                      "Please confirm your password",
                    ),
                  },
                  ({ getFieldValue }) => ({
                    validator(_: unknown, value: string) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          translate(
                            "pages.register.errors.passwordMismatch",
                            "The two passwords that you entered do not match!",
                          ),
                        ),
                      );
                    },
                  }),
                ]}
              >
                <Input type="password" placeholder="●●●●●●●●" size="large" />
              </Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <Typography.Text
                  style={{
                    fontSize: 12,
                    marginLeft: "auto",
                  }}
                >
                  {translate(
                    "pages.register.buttons.haveAccount",
                    "Have an account?",
                  )}{" "}
                  <a
                    href="/login"
                    style={{
                      fontWeight: "bold",
                      color: token.colorPrimaryTextHover,
                    }}
                  >
                    {translate("pages.register.signin", "Sign in")}
                  </a>
                </Typography.Text>
              </div>
              <Form.Item
                style={{
                  marginBottom: 0,
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={isPending}
                  block
                >
                  {translate("pages.register.buttons.submit", "Sign up")}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};