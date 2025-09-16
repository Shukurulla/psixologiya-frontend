import React from "react";
import { Card, Row, Col, Table, Tag, Progress, Spin, Statistic } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "../../services/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Statistics = () => {
  const { data: testStats, isLoading } = useQuery({
    queryKey: ["testStatistics"],
    queryFn: adminAPI.getTestStatistics,
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "normal":
        return "#52c41a";
      case "mild":
        return "#1890ff";
      case "moderate":
        return "#faad14";
      case "severe":
        return "#ff4d4f";
      default:
        return "#d9d9d9";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  const stats = testStats?.data || [];

  // Prepare data for charts
  const completionData = stats.map((test) => ({
    name:
      test.testName.length > 20
        ? test.testName.substring(0, 20) + "..."
        : test.testName,
    completed: test.totalCompleted,
    needsAttention: test.needsAttentionCount,
  }));

  const severityData = stats.reduce((acc, test) => {
    test.severityDistribution?.forEach((item) => {
      const existing = acc.find((a) => a.name === item._id);
      if (existing) {
        existing.value += item.count;
      } else {
        acc.push({ name: item._id || "Noaniq", value: item.count });
      }
    });
    return acc;
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Umumiy Statistika</h2>
        <p className="text-gray-600">
          Barcha testlar va natijalar bo'yicha statistik ma'lumotlar
        </p>
      </div>

      {/* Overall Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        {stats.map((test, index) => (
          <Col xs={24} sm={12} md={6} key={test.testId}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover">
                <Statistic
                  title={test.testName}
                  value={test.totalCompleted}
                  suffix="ta"
                  valueStyle={{
                    color: test.needsAttentionCount > 0 ? "#ff4d4f" : "#52c41a",
                  }}
                />
                {test.needsAttentionCount > 0 && (
                  <div className="mt-2">
                    <Tag color="error">
                      {test.needsAttentionCount} ta e'tibor talab
                    </Tag>
                  </div>
                )}
                {test.isSensitive && (
                  <Tag color="orange" className="mt-2">
                    Maxfiy
                  </Tag>
                )}
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        {/* Completion Bar Chart */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card title="Testlar bo'yicha bajarilish" className="card-hover">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#0088FE" name="Topshirilgan" />
                  <Bar
                    dataKey="needsAttention"
                    fill="#FF8042"
                    name="E'tibor talab"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Severity Pie Chart */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card title="Natijalar darajasi bo'yicha" className="card-hover">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getSeverityColor(entry.name)}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Department Statistics Table */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card title="Test bo'yicha batafsil statistika">
              <Table
                dataSource={stats}
                rowKey="testId"
                scroll={{ x: 800 }}
                columns={[
                  {
                    title: "Test nomi",
                    dataIndex: "testName",
                    key: "testName",
                    fixed: "left",
                    width: 200,
                  },
                  {
                    title: "Jami topshirilgan",
                    dataIndex: "totalCompleted",
                    key: "totalCompleted",
                    sorter: (a, b) => a.totalCompleted - b.totalCompleted,
                  },
                  {
                    title: "E'tibor talab",
                    dataIndex: "needsAttentionCount",
                    key: "needsAttentionCount",
                    render: (count) =>
                      count > 0 ? (
                        <Tag color="error">{count}</Tag>
                      ) : (
                        <Tag color="success">0</Tag>
                      ),
                    sorter: (a, b) =>
                      a.needsAttentionCount - b.needsAttentionCount,
                  },
                  {
                    title: "Eng ko'p topshirgan fakultetlar",
                    dataIndex: "topDepartments",
                    key: "topDepartments",
                    render: (departments) => (
                      <div>
                        {departments?.slice(0, 3).map((dept, index) => (
                          <div key={index} className="text-sm">
                            {dept._id}: <strong>{dept.count}</strong>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    title: "Maxfiy",
                    dataIndex: "isSensitive",
                    key: "isSensitive",
                    render: (sensitive) =>
                      sensitive ? (
                        <Tag color="orange">Ha</Tag>
                      ) : (
                        <Tag>Yo'q</Tag>
                      ),
                    filters: [
                      { text: "Maxfiy", value: true },
                      { text: "Oddiy", value: false },
                    ],
                    onFilter: (value, record) => record.isSensitive === value,
                  },
                ]}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Jami ${total} ta test`,
                }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
