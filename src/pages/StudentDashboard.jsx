import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  FileTextOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Layout from "../components/common/Layout";
import TestList from "../components/student/TestList";
import TestForm from "../components/student/TestForm";
import Results from "../components/student/Results";
import StudentHome from "../components/student/StudentHome";
import Chat from "../components/student/Chat";
import Appointments from "../components/student/Appointments";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/student/dashboard",
      icon: <DashboardOutlined />,
      label: "Bosh sahifa",
      onClick: () => navigate("/student/dashboard"),
    },
    {
      key: "/student/tests",
      icon: <FileTextOutlined />,
      label: "Testlar",
      onClick: () => navigate("/student/tests"),
    },
    {
      key: "/student/results",
      icon: <BarChartOutlined />,
      label: "Natijalar",
      onClick: () => navigate("/student/results"),
    },
    {
      key: "/student/chat",
      icon: <MessageOutlined />,
      label: "Psixolog bilan suhbat",
      onClick: () => navigate("/student/chat"),
    },
    {
      key: "/student/appointments",
      icon: <CalendarOutlined />,
      label: "Qabulga yozilish",
      onClick: () => navigate("/student/appointments"),
    },
  ];

  return (
    <Layout menuItems={menuItems} title="Talaba paneli">
      <Routes>
        <Route path="dashboard" element={<StudentHome />} />
        <Route path="tests" element={<TestList />} />
        <Route path="tests/:testId" element={<TestForm />} />
        <Route path="results" element={<Results />} />
        <Route path="chat" element={<Chat />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="*" element={<StudentHome />} />
      </Routes>
    </Layout>
  );
};

export default StudentDashboard;
