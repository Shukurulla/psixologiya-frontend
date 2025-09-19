import React, { useEffect } from "react";
import { Card, Row, Col, Badge, Button, Tag, Empty, Spin, message } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  LockOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { testAPI } from "../../services/api";

const TestList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data: tests, isLoading, refetch } = useQuery({
    queryKey: ["tests"],
    queryFn: testAPI.getTests,
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true,
  });

  // Test topshirilgandan keyin sahifaga qaytganda ma'lumotlarni yangilash
  useEffect(() => {
    if (location.state?.testCompleted) {
      // URL state-ni tozalash
      window.history.replaceState({}, document.title);
      
      // Test ma'lumotlarini qayta yuklash
      refetch();
      
      message.success("Test muvaffaqiyatli topshirildi!");
    }
  }, [location.state, refetch]);

  const getTestStatusIcon = (test) => {
    if (test.isCompleted) {
      return <CheckCircleOutlined className="text-green-500 text-xl" />;
    }
    if (test.isSensitive) {
      return <LockOutlined className="text-orange-500 text-xl" />;
    }
    return <PlayCircleOutlined className="text-blue-500 text-xl" />;
  };

  const getTestStatusTag = (test) => {
    if (test.isCompleted) {
      return <Tag color="success">Topshirilgan</Tag>;
    }
    return <Tag color="processing">Kutilmoqda</Tag>;
  };

  const handleStartTest = (testId) => {
    navigate(`/student/tests/${testId}`);
  };

  const handleRefresh = () => {
    refetch();
    message.info("Ma'lumotlar yangilanmoqda...");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!tests?.data || tests.data.length === 0) {
    return (
      <div className="text-center">
        <Empty description="Testlar topilmadi" />
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          className="mt-4"
        >
          Yangilash
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Psixologik Testlar</h2>
          <p className="text-gray-600">
            Barcha testlarni to'ldirishingiz so'raladi. Har bir test taxminan 5-20
            daqiqa vaqt oladi.
          </p>
        </div>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          loading={isLoading}
        >
          Yangilash
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {tests.data.map((test, index) => (
          <Col xs={24} sm={12} lg={8} key={test._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Badge.Ribbon
                text={test.order ? `#${test.order}` : "Test"}
                color={test.isCompleted ? "green" : "blue"}
              >
                <Card
                  className={`card-hover h-full ${
                    test.isCompleted ? "opacity-75" : ""
                  }`}
                  actions={[
                    test.isCompleted ? (
                      <Button disabled icon={<CheckCircleOutlined />}>
                        Topshirilgan
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={() => handleStartTest(test._id)}
                      >
                        Boshlash
                      </Button>
                    ),
                  ]}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getTestStatusIcon(test)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {test.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {test.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          <ClockCircleOutlined className="mr-1" />
                          {test.estimatedTime} daqiqa
                        </span>
                        {getTestStatusTag(test)}
                      </div>
                    </div>
                  </div>
                </Card>
              </Badge.Ribbon>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TestList;