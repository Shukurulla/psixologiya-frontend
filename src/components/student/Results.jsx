import { Card, Tag, Empty, Spin } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 sm:mb-6"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Test natijalari</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Topshirgan testlaringiz natijalari va holatini ko'rishingiz mumkin
        </p>
      </motion.div>

      {results?.data && results.data.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {results.data.map((result, index) => (
            <motion.div
              key={result._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className="hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="space-y-3">
                  {/* Header - Test nomi va holat */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1">
                        Test {result.test?.order || ''}
                      </h3>
                    </div>
                    <div>
                      {result.isCompleted ? (
                        <Tag icon={<CheckCircleOutlined />} color="success" className="text-xs sm:text-sm">
                          Topshirilgan
                        </Tag>
                      ) : (
                        <Tag icon={<ClockCircleOutlined />} color="processing" className="text-xs sm:text-sm">
                          Jarayonda
                        </Tag>
                      )}
                    </div>
                  </div>

                  {/* Natija */}
                  {result.isCompleted && (
                    <>
                      <div className="border-t pt-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Ball */}
                          {result.scores && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Ball:</p>
                              <div className="flex items-center gap-2">
                                <TrophyOutlined className="text-green-500 text-lg" />
                                <span className="text-lg sm:text-xl font-bold text-green-600">
                                  {result.scores.total || 0}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Topshirilgan vaqt */}
                      {result.completedAt && (
                        <div className="border-t pt-3">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <CalendarOutlined />
                            <span>
                              Topshirilgan: {new Date(result.completedAt).toLocaleDateString("uz-UZ", {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <Empty
              description="Hali test topshirilmagan"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        </motion.div>
      )}

    </div>
  );
};

export default Results;
