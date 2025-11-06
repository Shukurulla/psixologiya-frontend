import { useEffect, useState } from "react";
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
    <div className="px-2 sm:px-0">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 sm:mb-6"
      >
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h1 className="text-lg sm:text-2xl font-bold mb-2">
            Xush kelibsiz, {user?.full_name}!
          </h1>
          <p className="text-white/90 text-xs sm:text-sm">
            {user?.department?.name} | {user?.group?.name} | {user?.level?.name}
          </p>
        </Card>
      </motion.div>

      {/* Statistics Cards */}
      <Row gutter={[12, 12]} className="mb-4 sm:mb-6">
        <Col xs={12} sm={12} lg={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Card className="card-hover">
              <Statistic
                title={<span className="text-xs sm:text-sm">Jami testlar</span>}
                value={stats?.data?.totalTests || 0}
                prefix={<FileTextOutlined className="text-sm sm:text-base" />}
                valueStyle={{ color: "#1677ff", fontSize: "20px" }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Card className="card-hover">
              <Statistic
                title={<span className="text-xs sm:text-sm">Topshirilgan</span>}
                value={stats?.data?.completedTests || 0}
                prefix={<CheckCircleOutlined className="text-sm sm:text-base" />}
                valueStyle={{ color: "#52c41a", fontSize: "20px" }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Card className="card-hover">
              <Statistic
                title={<span className="text-xs sm:text-sm">Kutilmoqda</span>}
                value={stats?.data?.pendingTests || 0}
                prefix={<ClockCircleOutlined className="text-sm sm:text-base" />}
                valueStyle={{ color: "#faad14", fontSize: "20px" }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={12} sm={12} lg={6}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Card className="card-hover">
              <Statistic
                title={<span className="text-xs sm:text-sm">Bajarilish</span>}
                value={stats?.data?.completionRate || 0}
                suffix="%"
                prefix={<TrophyOutlined className="text-sm sm:text-base" />}
                valueStyle={{ color: "#722ed1", fontSize: "20px" }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Progress and Recent Results */}
      <Row gutter={[12, 12]}>
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card
              title={<span className="text-sm sm:text-base">Test bajarish jarayoni</span>}
              className="card-hover"
            >
              <Progress
                percent={stats?.data?.completionRate || 0}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                status="active"
              />
              <p className="mt-4 text-xs sm:text-sm text-gray-600">
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
            <Card
              title={<span className="text-sm sm:text-base">So'nggi natijalar</span>}
              className="card-hover"
            >
              {stats?.data?.recentResults?.length > 0 ? (
                <List
                  dataSource={stats.data.recentResults}
                  renderItem={(item, index) => (
                    <List.Item className="px-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-1 sm:gap-0">
                        <span className="text-xs sm:text-sm">Test {item.testOrder || index + 1}</span>
                        <Tag color="green" className="text-xs self-start sm:self-auto">
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
