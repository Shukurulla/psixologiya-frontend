import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Tabs, message } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { authAPI } from "../services/api";
import { authService } from "../services/auth";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("student");
  const navigate = useNavigate();

  const handleStudentLogin = async (values) => {
    try {
      setLoading(true);
      const response = await authAPI.studentLogin(values);

      if (response.success) {
        authService.setAuthData(
          response.data.token,
          response.data.student,
          "student"
        );
        message.success("Muvaffaqiyatli kirdingiz!");
        navigate("/student/dashboard");
      }
    } catch (error) {
      message.error(error?.error || "Login yoki parol xato");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (values) => {
    try {
      setLoading(true);
      const response = await authAPI.adminLogin(values);

      if (response.success) {
        authService.setAuthData(
          response.data.token,
          response.data.admin,
          "admin"
        );
        message.success("Muvaffaqiyatli kirdingiz!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      message.error(error?.error || "Login yoki parol xato");
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: "student",
      label: "Talaba",
      children: (
        <Form
          name="student_login"
          onFinish={handleStudentLogin}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="student_id_number"
            rules={[
              { required: true, message: "Talaba ID raqamini kiriting!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Talaba ID raqami"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Parolni kiriting!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Parol"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<LoginOutlined />}
              size="large"
              block
            >
              Kirish
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "admin",
      label: "Admin",
      children: (
        <Form
          name="admin_login"
          onFinish={handleAdminLogin}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Username kiriting!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Parolni kiriting!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Parol"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<LoginOutlined />}
              size="large"
              block
            >
              Kirish
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card
          className="shadow-2xl rounded-lg overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
          <div className="bg-white p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-center mb-6"
            >
              <h1 className="text-3xl font-bold text-gray-800">
                Psixologik Test Tizimi
              </h1>
              <p className="text-gray-600 mt-2">
                Tizimga kirish uchun ma'lumotlaringizni kiriting
              </p>
            </motion.div>

            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              centered
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
