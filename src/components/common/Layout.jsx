import { useState, useEffect } from "react";
import {
  Layout as AntLayout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Badge,
  Drawer,
} from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/auth";

const { Header, Sider, Content } = AntLayout;

const Layout = ({ children, menuItems, title }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getUser();
  const role = authService.getRole();

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close drawer when route changes
  useEffect(() => {
    setMobileDrawerVisible(false);
  }, [location.pathname]);

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

  const SidebarContent = () => (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-16 flex items-center justify-center text-white text-xl font-bold"
      >
        {!collapsed && !isMobile ? "Psixologik Test" : "Psixologik Test"}
      </motion.div>

      <Menu
        theme="dark"
        mode="inline"
        items={menuItems}
        className="bg-transparent"
        style={{ background: "transparent" }}
      />
    </>
  );

  return (
    <AntLayout className="min-h-screen">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="shadow-xl"
          style={{
            background: "linear-gradient(180deg, #1677ff 0%, #0958d9 100%)",
          }}
        >
          <SidebarContent />
        </Sider>
      )}

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={() => setMobileDrawerVisible(false)}
        open={mobileDrawerVisible}
        closable={false}
        width={250}
        bodyStyle={{
          padding: 0,
          background: "linear-gradient(180deg, #1677ff 0%, #0958d9 100%)",
        }}
        className="md:hidden"
      >
        <div className="flex justify-end p-4">
          <CloseOutlined
            className="text-white text-xl cursor-pointer"
            onClick={() => setMobileDrawerVisible(false)}
          />
        </div>
        <SidebarContent />
      </Drawer>

      <AntLayout>
        <Header className="bg-white px-3 sm:px-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {isMobile ? (
                <MenuOutlined
                  className="text-lg sm:text-xl cursor-pointer"
                  onClick={() => setMobileDrawerVisible(true)}
                />
              ) : (
                <>
                  {collapsed ? (
                    <MenuUnfoldOutlined
                      className="text-lg sm:text-xl cursor-pointer"
                      onClick={() => setCollapsed(!collapsed)}
                    />
                  ) : (
                    <MenuFoldOutlined
                      className="text-lg sm:text-xl cursor-pointer"
                      onClick={() => setCollapsed(!collapsed)}
                    />
                  )}
                </>
              )}
            </motion.div>

            <h1 className="text-sm sm:text-xl font-semibold m-0 truncate max-w-[150px] sm:max-w-none">
              {title}
            </h1>
          </div>

          <Space size="middle" className="sm:space-x-4">
            <Badge count={0} className="hidden sm:inline-block">
              <BellOutlined className="text-lg sm:text-xl cursor-pointer" />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer">
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1677ff" }}
                  size={isMobile ? "small" : "default"}
                />
                <div className="text-right hidden sm:block">
                  <div className="font-medium text-sm">
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

        <Content className="m-3 sm:m-6">
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
