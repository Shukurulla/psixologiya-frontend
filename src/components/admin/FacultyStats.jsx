import React, { useState } from "react";
import { Card, Table, Tag, Progress, Spin, Button, Modal, List } from "antd";
import {
  TeamOutlined,
  BarChartOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "../../services/api";

const FacultyStats = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: faculties, isLoading } = useQuery({
    queryKey: ["facultyStats"],
    queryFn: adminAPI.getFaculties,
  });

  const handleViewDetails = (faculty) => {
    setSelectedFaculty(faculty);
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Fakultet nomi",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">Kod: {record.code}</div>
        </div>
      ),
    },
    {
      title: "Talabalar soni",
      dataIndex: "studentCount",
      key: "studentCount",
      render: (count) => (
        <div className="flex items-center gap-2">
          <TeamOutlined />
          <span className="font-medium">{count}</span>
        </div>
      ),
      sorter: (a, b) => a.studentCount - b.studentCount,
    },
    {
      title: "Guruhlar soni",
      dataIndex: "groupCount",
      key: "groupCount",
      render: (count) => <Tag color="blue">{count} ta guruh</Tag>,
    },
    {
      title: "Topshirilgan testlar",
      dataIndex: "completedTests",
      key: "completedTests",
      render: (count, record) => (
        <div>
          <span className="font-medium">{count}</span>
          <span className="text-gray-500 text-sm ml-1">
            / {record.studentCount * 8}
          </span>
        </div>
      ),
      sorter: (a, b) => a.completedTests - b.completedTests,
    },
    {
      title: "Bajarilish darajasi",
      dataIndex: "averageCompletion",
      key: "averageCompletion",
      render: (percent) => (
        <Progress
          percent={Math.round(percent)}
          size="small"
          strokeColor={{
            "0%": "#ff4d4f",
            "50%": "#faad14",
            "100%": "#52c41a",
          }}
        />
      ),
      sorter: (a, b) => a.averageCompletion - b.averageCompletion,
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
          size="small"
        >
          Batafsil
        </Button>
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Fakultetlar statistikasi</h2>
        <p className="text-gray-600">
          Barcha fakultetlar bo'yicha test topshirish ko'rsatkichlari
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <Table
            dataSource={faculties?.data || []}
            columns={columns}
            rowKey="name"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Jami ${total} ta fakultet`,
            }}
          />
        </Card>
      </motion.div>

      {/* Faculty Details Modal */}
      <Modal
        title={`${selectedFaculty?.name} - Batafsil ma'lumot`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedFaculty && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card size="small">
                <div className="text-gray-600 text-sm">Talabalar soni</div>
                <div className="text-2xl font-bold">
                  {selectedFaculty.studentCount}
                </div>
              </Card>
              <Card size="small">
                <div className="text-gray-600 text-sm">Guruhlar soni</div>
                <div className="text-2xl font-bold">
                  {selectedFaculty.groupCount}
                </div>
              </Card>
              <Card size="small">
                <div className="text-gray-600 text-sm">
                  Topshirilgan testlar
                </div>
                <div className="text-2xl font-bold">
                  {selectedFaculty.completedTests}
                </div>
              </Card>
              <Card size="small">
                <div className="text-gray-600 text-sm">Bajarilish</div>
                <div className="text-2xl font-bold">
                  {Math.round(selectedFaculty.averageCompletion)}%
                </div>
              </Card>
            </div>

            {selectedFaculty.tests && selectedFaculty.tests.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">
                  <FileTextOutlined className="mr-2" />
                  Test bo'yicha statistika
                </h4>
                <List
                  dataSource={selectedFaculty.tests}
                  renderItem={(test) => (
                    <List.Item>
                      <div className="flex justify-between w-full">
                        <div>
                          <span className="font-medium">{test.testName}</span>
                          <Tag className="ml-2" color="blue">
                            {test.completionCount} ta
                          </Tag>
                        </div>
                        {test.needsAttentionCount > 0 && (
                          <Tag color="error">
                            {test.needsAttentionCount} ta e'tibor talab
                          </Tag>
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FacultyStats;
