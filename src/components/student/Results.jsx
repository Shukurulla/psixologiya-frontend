import React from "react";
import { Card, Table, Tag, Empty, Spin, Badge, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeInvisibleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { studentAPI } from "../../services/api";

const Results = () => {
  const { data: results, isLoading } = useQuery({
    queryKey: ["testResults"],
    queryFn: studentAPI.getTestResults,
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "normal":
        return "green";
      case "mild":
        return "blue";
      case "moderate":
        return "orange";
      case "severe":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Test nomi",
      dataIndex: ["test", "name"],
      key: "testName",
      render: (text, record) => (
        <div className="font-medium">
          {text}
          {record.isSensitive && (
            <Tooltip title="Maxfiy test - natijalar ko'rib chiqilmoqda">
              <EyeInvisibleOutlined className="ml-2 text-orange-500" />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Holat",
      dataIndex: "isCompleted",
      key: "status",
      render: (completed) =>
        completed ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Topshirilgan
          </Tag>
        ) : (
          <Tag icon={<ClockCircleOutlined />} color="processing">
            Jarayonda
          </Tag>
        ),
    },
    {
      title: "Natija",
      key: "result",
      render: (record) => {
        if (record.isSensitive) {
          return <Tag color="orange">Ko'rib chiqilmoqda</Tag>;
        }

        if (record.interpretation) {
          return (
            <div>
              <Tag color={getSeverityColor(record.interpretation.severity)}>
                {record.interpretation.level}
              </Tag>
              <div className="text-sm text-gray-600 mt-1">
                {record.interpretation.description}
              </div>
            </div>
          );
        }

        return <span className="text-gray-500">-</span>;
      },
    },
    {
      title: "Ball",
      key: "score",
      render: (record) => {
        if (record.isSensitive || !record.scores) {
          return <span className="text-gray-500">-</span>;
        }
        return (
          <Badge
            count={record.scores.total || 0}
            showZero
            style={{ backgroundColor: "#52c41a" }}
          />
        );
      },
    },
    {
      title: "Topshirilgan vaqt",
      dataIndex: "completedAt",
      key: "completedAt",
      render: (date) =>
        date ? (
          <span className="text-gray-600">
            <CalendarOutlined className="mr-1" />
            {new Date(date).toLocaleDateString("uz-UZ")}
          </span>
        ) : (
          "-"
        ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2">Test natijalari</h2>
        <p className="text-gray-600">
          Topshirgan testlaringiz natijalari va holatini ko'rishingiz mumkin
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          {results?.data && results.data.length > 0 ? (
            <Table
              dataSource={results.data}
              columns={columns}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Jami ${total} ta natija`,
              }}
            />
          ) : (
            <Empty
              description="Hali test topshirilmagan"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>
      </motion.div>

      {/* Information Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4"
      >
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <EyeInvisibleOutlined className="text-blue-500 text-xl mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900">
                Maxfiy testlar haqida
              </h4>
              <p className="text-blue-800 text-sm mt-1">
                Ba'zi testlar (depressiya, xavotir) maxfiy hisoblanadi. Bu test
                natijalari psixolog tomonidan ko'rib chiqiladi va kerakli yordam
                ko'rsatiladi.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Results;
