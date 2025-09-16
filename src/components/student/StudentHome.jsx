import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  List,
  Tag,
  Empty,
  Spin,
} from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { studentAPI } from "../../services/api";
import { authService } from "../../services/auth";

const StudentHome = () => {
  const user = authService.getUser();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["studentStats"],
    queryFn: studentAPI.getStatistics,
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Xush kelibsiz, {user?.full_name}!
          </h1>
          <p className="text-white/90">
            {user?.department?.name} | {user?.group?.name} | {user?.level?.name}
          </p>
        </Card>
      </motion.div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Card className="card-hover">
              <Statistic
                title="Jami testlar"
                value={stats?.data?.totalTests || 0}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#1677ff" }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Card className="card-hover">
              <Statistic
                title="Topshirilgan"
                value={stats?.data?.completedTests || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Card className="card-hover">
              <Statistic
                title="Kutilmoqda"
                value={stats?.data?.pendingTests || 0}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Card className="card-hover">
              <Statistic
                title="Bajarilish"
                value={stats?.data?.completionRate || 0}
                suffix="%"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Progress and Recent Results */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card title="Test bajarish jarayoni" className="card-hover">
              <Progress
                percent={stats?.data?.completionRate || 0}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                status="active"
              />
              <p className="mt-4 text-gray-600">
                {stats?.data?.completedTests || 0} ta test topshirildi,{" "}
                {stats?.data?.pendingTests || 0} ta test qoldi
              </p>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card title="So'nggi natijalar" className="card-hover">
              {stats?.data?.recentResults?.length > 0 ? (
                <List
                  dataSource={stats.data.recentResults}
                  renderItem={(item) => (
                    <List.Item>
                      <div className="flex justify-between w-full">
                        <span>{item.testName}</span>
                        <Tag color="green">
                          {new Date(item.completedAt).toLocaleDateString()}
                        </Tag>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="Hali test topshirilmagan" />
              )}
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default StudentHome;
