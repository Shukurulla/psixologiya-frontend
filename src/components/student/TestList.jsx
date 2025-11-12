import { useEffect } from "react";
import { Card, Row, Col, Badge, Button, Tag, Empty, Spin, message } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
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
      return <CheckCircleOutlined className="text-green-500 text-lg sm:text-xl" />;
    }
    return <PlayCircleOutlined className="text-blue-500 text-lg sm:text-xl" />;
  };

  const getTestStatusTag = (test) => {
    if (test.isCompleted) {
      return <Tag color="success" className="text-xs">Topshirilgan</Tag>;
    }
    return <Tag color="processing" className="text-xs">Kutilmoqda</Tag>;
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
      <div className="text-center px-2">
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
    <div className="px-2 sm:px-0">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Psixologik Testlar</h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Barcha testlarni to'ldirishingiz so'raladi. Har bir test taxminan 5-20
            daqiqa vaqt oladi.
          </p>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={isLoading}
          size="middle"
          className="self-start sm:self-auto"
        >
          Yangilash
        </Button>
      </div>

      <Row gutter={[12, 12]}>
        {tests.data.map((test, index) => (
          <Col xs={24} sm={12} lg={8} key={test._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Badge.Ribbon
                text={`#${index + 1}`}
                color={test.isCompleted ? "green" : "blue"}
              >
                <Card
                  className={`card-hover h-full ${
                    test.isCompleted ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="mt-1">{getTestStatusIcon(test)}</div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">
                        Test {index + 1}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
                        Psixologik baholash testi
                      </p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs sm:text-sm text-gray-500">
                          <ClockCircleOutlined className="mr-1" />
                          {test.estimatedTime} daqiqa
                        </span>
                        {getTestStatusTag(test)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    {test.isCompleted ? (
                      <Button
                        disabled
                        icon={<CheckCircleOutlined />}
                        block
                        size="large"
                        className="text-xs sm:text-sm"
                      >
                        Topshirilgan
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={() => handleStartTest(test._id)}
                        block
                        size="large"
                        className="text-xs sm:text-sm"
                      >
                        Boshlash
                      </Button>
                    )}
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
