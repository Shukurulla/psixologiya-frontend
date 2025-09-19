import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  TeamOutlined,
  BarChartOutlined,
  FileTextOutlined,
  AlertOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Layout from "../components/common/Layout";
import Dashboard from "../components/admin/Dashboard";
import Statistics from "../components/admin/Statistics";
import FacultyStats from "../components/admin/FacultyStats";
import GroupStats from "../components/admin/GroupStats";
import AttentionNeeds from "../components/admin/AttentionNeeds";
import DetailedResults from "../components/admin/DetailedResults";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Bosh panel",
      onClick: () => navigate("/admin/dashboard"),
    },
    {
      key: "/admin/statistics",
      icon: <BarChartOutlined />,
      label: "Statistika",
      onClick: () => navigate("/admin/statistics"),
    },
    {
      key: "/admin/results",
      icon: <UnorderedListOutlined />,
      label: "Batafsil natijalar",
      onClick: () => navigate("/admin/results"),
    },
    {
      key: "/admin/attention",
      icon: <AlertOutlined />,
      label: "E'tibor talab",
      onClick: () => navigate("/admin/attention"),
    },
    {
      key: "/admin/faculties",
      icon: <TeamOutlined />,
      label: "Fakultetlar",
      onClick: () => navigate("/admin/faculties"),
    },
    {
      key: "/admin/groups",
      icon: <FileTextOutlined />,
      label: "Guruhlar",
      onClick: () => navigate("/admin/groups"),
    },
  ];

  return (
    <Layout menuItems={menuItems} title="Admin paneli">
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="results" element={<DetailedResults />} />
        <Route path="attention" element={<AttentionNeeds />} />
        <Route path="faculties" element={<FacultyStats />} />
        <Route path="groups" element={<GroupStats />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboard;
