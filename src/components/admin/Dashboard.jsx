import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Badge,
  Alert,
  Spin,
  Progress,
  List,
  Avatar,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  TeamOutlined,
  FundProjectionScreenOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "../../services/api";

const Dashboard = () => {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: adminAPI.getDashboard,
    refetchInterval: 30000, // Har 30 sekundda yangilanadi
  });

  const needsAttentionColumns = [
    {
      title: "Talaba",
      dataIndex: "studentName",
      key: "studentName",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">ID: {record.studentId}</div>
        </div>
      ),
    },
    {
      title: "Test",
      dataIndex: "testName",
      key: "testName",
      render: (text) => <span className="text-sm">{text}</span>,
    },
    {
      title: "Sana",
      dataIndex: "completedAt",
      key: "completedAt",
      render: (date) => (
        <span className="text-sm">
          {new Date(date).toLocaleDateString("uz-UZ")}
        </span>
      ),
    },
    {
      title: "Holat",
      key: "status",
      render: (record) =>
        record.needsAttention ? (
          <Tag color="error" icon={<WarningOutlined />}>
            E'tibor talab
          </Tag>
        ) : (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Normal
          </Tag>
        ),
    },
  ];

  const recentTestColumns = [
    {
      title: "Talaba",
      dataIndex: "studentName",
      key: "studentName",
      ellipsis: true,
    },
    {
      title: "Test",
      dataIndex: "testName",
      key: "testName",
      ellipsis: true,
    },
    {
      title: "Vaqt",
      dataIndex: "completedAt",
      key: "completedAt",
      render: (date) => {
        const now = new Date();
        const completed = new Date(date);
        const diff = Math.floor((now - completed) / 60000); // minutlarda

        if (diff < 60) return `${diff} daqiqa oldin`;
        if (diff < 1440) return `${Math.floor(diff / 60)} soat oldin`;
        return `${Math.floor(diff / 1440)} kun oldin`;
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Ma'lumotlar yuklanmoqda..." />
      </div>
    );
  }

  const stats = dashboard?.data?.overview || {};
  const completionStats = dashboard?.data?.completionStats || [];
  const recentResults = dashboard?.data?.recentResults || [];

  // Calculate trends (mock data for demonstration)
  const studentTrend = stats.totalStudents > 25000 ? "+2.3%" : "-1.2%";
  const testTrend = stats.totalResults > 100000 ? "+15.6%" : "+5.4%";
  const attentionTrend = stats.needsAttentionCount > 10 ? "+3" : "0";

  return (
    <div className="space-y-6">
      {/* Alert for attention needed */}
      {stats.needsAttentionCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert
            message={
              <span className="font-semibold">
                {stats.needsAttentionCount} ta talaba e'tibor talab qilmoqda
              </span>
            }
            description={
              <span>
                Iltimos, ushbu talabalar natijalarini ko'rib chiqing va kerakli
                choralar ko'ring.
                <a
                  href="/admin/attention"
                  className="ml-2 font-medium text-blue-600 hover:underline"
                >
                  Batafsil ko'rish →
                </a>
              </span>
            }
            type="warning"
            showIcon
            closable
            icon={<WarningOutlined />}
          />
        </motion.div>
      )}

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card-hover shadow-sm">
              <Statistic
                title={
                  <span className="text-gray-600 flex items-center justify-between">
                    Jami talabalar
                    <span
                      className={`text-xs ${
                        studentTrend.startsWith("+")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {studentTrend.startsWith("+") ? (
                        <RiseOutlined />
                      ) : (
                        <FallOutlined />
                      )}
                      {studentTrend}
                    </span>
                  </span>
                }
                value={stats.totalStudents || 0}
                prefix={<UserOutlined className="text-blue-500" />}
                formatter={(value) => value.toLocaleString()}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card-hover shadow-sm">
              <Statistic
                title={
                  <span className="text-gray-600 flex items-center justify-between">
                    Topshirilgan testlar
                    <span className="text-xs text-green-500">
                      <RiseOutlined />
                      {testTrend}
                    </span>
                  </span>
                }
                value={stats.totalResults || 0}
                prefix={<CheckCircleOutlined className="text-green-500" />}
                formatter={(value) => value.toLocaleString()}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card-hover shadow-sm">
              <Badge count={stats.needsAttentionCount} offset={[-5, 5]}>
                <Statistic
                  title={
                    <span className="text-gray-600 flex items-center justify-between">
                      E'tibor talab
                      <span className="text-xs text-orange-500">
                        {attentionTrend}
                      </span>
                    </span>
                  }
                  value={stats.needsAttentionCount || 0}
                  prefix={<WarningOutlined className="text-red-500" />}
                  valueStyle={{
                    color:
                      stats.needsAttentionCount > 0 ? "#ff4d4f" : "#52c41a",
                  }}
                />
              </Badge>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="card-hover shadow-sm">
              <Statistic
                title={
                  <span className="text-gray-600">O'rtacha bajarilish</span>
                }
                value={stats.averageCompletionRate || 0}
                suffix="%"
                prefix={
                  <FundProjectionScreenOutlined className="text-purple-500" />
                }
                valueStyle={{ color: "#722ed1" }}
              />
              <Progress
                percent={stats.averageCompletionRate || 0}
                showInfo={false}
                strokeColor="#722ed1"
                size="small"
                className="mt-2"
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Main Content Grid */}
      <Row gutter={[16, 16]}>
        {/* Completion by Test */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card
              title="Testlar bo'yicha bajarilish"
              className="card-hover shadow-sm"
              extra={
                <span className="text-sm text-gray-500">
                  Jami: {completionStats.length} ta test
                </span>
              }
            >
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {completionStats.length > 0 ? (
                  completionStats.map((test) => (
                    <div key={test._id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {test.testName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {test.completionCount} / {stats.totalStudents}
                          <span className="ml-2 font-medium">
                            ({Math.round(test.completionRate)}%)
                          </span>
                        </span>
                      </div>
                      <Progress
                        percent={Math.round(test.completionRate)}
                        size="small"
                        strokeColor={{
                          "0%": "#ff4d4f",
                          "50%": "#faad14",
                          "100%": "#52c41a",
                        }}
                        format={(percent) => `${percent}%`}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Ma'lumot mavjud emas
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </Col>

        {/* Recent Attention Results */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card
              title={
                <span>
                  E'tibor talab qiluvchi natijalar
                  {stats.needsAttentionCount > 0 && (
                    <Badge
                      count={stats.needsAttentionCount}
                      className="ml-2"
                      style={{ backgroundColor: "#ff4d4f" }}
                    />
                  )}
                </span>
              }
              className="card-hover shadow-sm"
              extra={
                <a
                  href="/admin/attention"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Barchasi →
                </a>
              }
            >
              <Table
                dataSource={recentResults
                  .filter((r) => r.needsAttention)
                  .slice(0, 5)}
                columns={needsAttentionColumns}
                pagination={false}
                size="small"
                scroll={{ y: 320 }}
                locale={{ emptyText: "E'tibor talab qiluvchi natija yo'q ✓" }}
                rowKey={(record) => `${record.studentId}-${record.testName}`}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Additional Stats */}
      <Row gutter={[16, 16]}>
        {/* Department Stats */}
        <Col xs={24} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card
              title="Fakultet statistikasi"
              className="shadow-sm"
              extra={
                <a
                  href="/admin/faculties"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Batafsil →
                </a>
              }
            >
              <div className="grid grid-cols-2 gap-4">
                <Statistic
                  title={<span className="text-xs">Fakultetlar</span>}
                  value={stats.totalDepartments || 0}
                  prefix={<TeamOutlined className="text-sm" />}
                />
                <Statistic
                  title={<span className="text-xs">Guruhlar</span>}
                  value={stats.totalGroups || 0}
                  prefix={<TeamOutlined className="text-sm" />}
                />
                <Statistic
                  title={<span className="text-xs">Aktiv testlar</span>}
                  value={stats.totalTests || 0}
                  prefix={<FileTextOutlined className="text-sm" />}
                />
                <Statistic
                  title={<span className="text-xs">O'rtacha ball</span>}
                  value={stats.averageScore || 0}
                  suffix={<span className="text-xs">/100</span>}
                />
              </div>
            </Card>
          </motion.div>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card title="So'nggi faollik" className="shadow-sm">
              <Table
                dataSource={recentResults.slice(0, 5)}
                columns={recentTestColumns}
                pagination={false}
                size="small"
                showHeader={false}
                locale={{ emptyText: "Faollik yo'q" }}
                rowKey={(record) => `${record.studentId}-${record.completedAt}`}
              />
            </Card>
          </motion.div>
        </Col>

        {/* Quick Stats */}
        <Col xs={24} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card title="Tezkor ma'lumot" className="shadow-sm">
              <List
                size="small"
                dataSource={[
                  {
                    label: "Bugun topshirilgan",
                    value: recentResults.filter((r) => {
                      const today = new Date().toDateString();
                      return new Date(r.completedAt).toDateString() === today;
                    }).length,
                    icon: <ClockCircleOutlined className="text-blue-500" />,
                  },
                  {
                    label: "Haftalik o'sish",
                    value: "+12.3%",
                    icon: <RiseOutlined className="text-green-500" />,
                  },
                  {
                    label: "Eng aktiv fakultet",
                    value: completionStats[0]?.department || "N/A",
                    icon: <TeamOutlined className="text-purple-500" />,
                  },
                  {
                    label: "Eng ko'p topshirilgan",
                    value:
                      completionStats[0]?.testName?.substring(0, 20) + "..." ||
                      "N/A",
                    icon: <FileTextOutlined className="text-orange-500" />,
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-sm text-gray-600">
                          {item.label}
                        </span>
                      </span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
