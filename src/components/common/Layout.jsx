import React from "react";
import {
  Layout as AntLayout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Badge,
} from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth";

const { Header, Sider, Content } = AntLayout;

const Layout = ({ children, menuItems, title }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const user = authService.getUser();
  const role = authService.getRole();

  const handleLogout = () => {
    authService.logout();
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profil",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Chiqish",
      onClick: handleLogout,
    },
  ];

  return (
    <AntLayout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="shadow-xl"
        style={{
          background: "linear-gradient(180deg, #1677ff 0%, #0958d9 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-16 flex items-center justify-center text-white text-xl font-bold"
        >
          {!collapsed ? "Psixologik Test" : "PT"}
        </motion.div>

        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          className="bg-transparent"
          style={{ background: "transparent" }}
        />
      </Sider>

      <AntLayout>
        <Header className="bg-white px-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "text-xl cursor-pointer",
                  onClick: () => setCollapsed(!collapsed),
                }
              )}
            </motion.div>

            <h1 className="text-xl font-semibold m-0">{title}</h1>
          </div>

          <Space size="large">
            <Badge count={0}>
              <BellOutlined className="text-xl cursor-pointer" />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer">
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1677ff" }}
                />
                <div className="text-right">
                  <div className="font-medium">
                    {user?.full_name || user?.fullName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {role === "student" ? "Talaba" : "Admin"}
                  </div>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className="m-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
