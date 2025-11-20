import React, { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import bg from "../../../assets/kantor.jpg";
import { login } from "../../../utils/apis";
import { setItem } from "../../../utils/storages";
import { jwtDecode } from "jwt-decode";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await login(values);
      const data = res?.data;

      if (!data?.token) throw new Error("Token tidak ditemukan dari server.");

      // 🔹 Decode token untuk ambil expiry
      const decoded = jwtDecode(data.token) as any;

      // 🔹 Simpan ke localStorage dengan struktur konsisten
      setItem({
        key: "profile",
        value: {
          token: data.token,
          data: data?.user || data?.data || {},
          expire: decoded?.exp,
        },
      });

      message.success("Login berhasil");

      // 🔹 Redirect ke admin
      setTimeout(() => {
        window.location.href = "/admin";
      }, 500);
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);
      message.error(
        err.response?.data?.message || "Login gagal, periksa kredensial Anda"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Overlay gelap */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      />

      {/* Card login */}
      <Card
        title={
          <div
            style={{
              textAlign: "center",
              fontSize: 24,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Logistik Dan Peralatan
          </div>
        }
        style={{
          width: 420,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
          background: "linear-gradient(135deg, #ff7e21 0%, #ff9f1c 100%)",
          border: "none",
          zIndex: 1,
        }}
        bodyStyle={{
          padding: 32,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(4px)",
        }}
      >
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Masukkan username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Masukkan username"
              size="large"
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Masukkan password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Masukkan password"
              size="large"
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                backgroundColor: "#ff7e21",
                borderColor: "#ff7e21",
              }}
            >
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
