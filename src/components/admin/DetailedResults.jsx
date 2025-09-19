import React, { useState } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Select,
  DatePicker,
  Space,
  Input,
  Modal,
  Descriptions,
  Progress,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  DownloadOutlined,
  FilterOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "../../services/api";

const { Option } = Select;
const { RangePicker } = DatePicker;

const DetailedResults = () => {
  const [filters, setFilters] = useState({
    testId: null,
    department: null,
    group: null,
    startDate: null,
    endDate: null,
    search: "",
    needsAttention: null,
  });
  const [selectedResult, setSelectedResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Get test results with filters
  const { data: results, isLoading } = useQuery({
    queryKey: ["detailedResults", filters],
    queryFn: () => adminAPI.getTestResults(filters),
    enabled: true,
  });

  // Get tests for filter
  const { data: tests } = useQuery({
    queryKey: ["testsForFilter"],
    queryFn: () => adminAPI.getTestStatistics(),
  });

  // Get faculties for filter
  const { data: faculties } = useQuery({
    queryKey: ["facultiesForFilter"],
    queryFn: adminAPI.getFaculties,
  });

  // Get groups for filter
  const { data: groups } = useQuery({
    queryKey: ["groupsForFilter", filters.department],
    queryFn: () => adminAPI.getGroups({ department: filters.department }),
    enabled: !!filters.department,
  });

  const handleViewResult = (record) => {
    setSelectedResult(record);
    setModalVisible(true);
  };

  const handleDateRangeChange = (dates) => {
    setFilters({
      ...filters,
      startDate: dates?.[0]?.format("YYYY-MM-DD"),
      endDate: dates?.[1]?.format("YYYY-MM-DD"),
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "severe":
        return "red";
      case "moderate":
        return "orange";
      case "mild":
        return "yellow";
      default:
        return "green";
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case "severe":
        return "Og'ir";
      case "moderate":
        return "O'rta";
      case "mild":
        return "Yengil";
      default:
        return "Normal";
    }
  };

  const columns = [
    {
      title: "Talaba",
      key: "student",
      render: (_, record) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            <UserOutlined className="text-blue-500" />
            {record.student?.full_name}
          </div>
          <div className="text-xs text-gray-500">
            ID: {record.student?.student_id_number}
          </div>
        </div>
      ),
      filterable: true,
    },
    {
      title: "Fakultet / Guruh",
      key: "department",
      render: (_, record) => (
        <div>
          <div className="text-sm font-medium">{record.department?.name}</div>
          <div className="text-xs text-gray-500">{record.group?.name}</div>
        </div>
      ),
    },
    {
      title: "Test",
      key: "test",
      render: (_, record) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            <FileTextOutlined className="text-green-500" />
            {record.test?.name}
          </div>
          {record.test?.isSensitive && (
            <Tag color="orange" size="small">
              Maxfiy
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Natija",
      key: "result",
      render: (_, record) => (
        <div>
          {record.scores?.total !== undefined && (
            <div className="mb-2">
              <Progress
                percent={Math.min((record.scores.total / 100) * 100, 100)}
                size="small"
                format={() => `${record.scores.total} ball`}
              />
            </div>
          )}
          <Tag color={getSeverityColor(record.interpretation?.severity)}>
            {record.interpretation?.level || "Aniqlanmagan"}
          </Tag>
          {record.needsAttention && (
            <Tag color="red" size="small" className="mt-1">
              E'tibor talab
            </Tag>
          )}
        </div>
      ),
      sorter: (a, b) => (a.scores?.total || 0) - (b.scores?.total || 0),
    },
    {
      title: "Sana",
      dataIndex: "completedAt",
      key: "completedAt",
      render: (date) => (
        <div className="flex items-center gap-1">
          <CalendarOutlined className="text-gray-400" />
          <div>
            <div className="text-sm">
              {new Date(date).toLocaleDateString("uz-UZ")}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(date).toLocaleTimeString("uz-UZ", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.completedAt) - new Date(b.completedAt),
    },
    {
      title: "Holat",
      key: "status",
      render: (_, record) => (
        <div>
          {record.needsAttention ? (
            record.isReviewed ? (
              <Tag color="blue">Ko'rib chiqilgan</Tag>
            ) : (
              <Tag color="red">E'tibor talab</Tag>
            )
          ) : (
            <Tag color="green">Normal</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewResult(record)}
        >
          Batafsil
        </Button>
      ),
    },
  ];

  const resultsData = results?.data?.results || [];
  const pagination = results?.data?.pagination || {};

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Batafsil test natijalari</h2>
        <p className="text-gray-600">
          Barcha test natijalarini ko'rish va tahlil qilish
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <Statistic
                title="Jami natijalar"
                value={pagination.total || 0}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <Statistic
                title="E'tibor talab"
                value={
                  resultsData.filter((r) => r.needsAttention && !r.isReviewed)
                    .length
                }
                prefix={<TrophyOutlined />}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <Statistic
                title="Ko'rib chiqilgan"
                value={resultsData.filter((r) => r.isReviewed).length}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <Statistic
                title="O'rtacha ball"
                value={
                  resultsData.length > 0
                    ? Math.round(
                        resultsData
                          .filter((r) => r.scores?.total)
                          .reduce((sum, r) => sum + r.scores.total, 0) /
                          resultsData.filter((r) => r.scores?.total).length
                      )
                    : 0
                }
                suffix="/100"
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Talaba ismi bo'yicha qidirish..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              allowClear
            />

            <Select
              placeholder="Testni tanlang"
              allowClear
              value={filters.testId}
              onChange={(value) => setFilters({ ...filters, testId: value })}
            >
              {tests?.data?.map((test) => (
                <Option key={test.testId} value={test.testId}>
                  {test.testName}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Fakultetni tanlang"
              allowClear
              value={filters.department}
              onChange={(value) =>
                setFilters({ ...filters, department: value, group: null })
              }
            >
              {faculties?.data?.map((faculty) => (
                <Option key={faculty.name} value={faculty.name}>
                  {faculty.name}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Guruhni tanlang"
              allowClear
              value={filters.group}
              onChange={(value) => setFilters({ ...filters, group: value })}
              disabled={!filters.department}
            >
              {groups?.data?.map((group) => (
                <Option key={group.name} value={group.name}>
                  {group.name}
                </Option>
              ))}
            </Select>

            <RangePicker
              placeholder={["Boshlanish", "Tugash"]}
              onChange={handleDateRangeChange}
              format="DD.MM.YYYY"
            />

            <Select
              placeholder="Holati"
              allowClear
              value={filters.needsAttention}
              onChange={(value) =>
                setFilters({ ...filters, needsAttention: value })
              }
            >
              <Option value="true">E'tibor talab</Option>
              <Option value="false">Normal</Option>
            </Select>

            <Button
              icon={<FilterOutlined />}
              onClick={() =>
                setFilters({
                  testId: null,
                  department: null,
                  group: null,
                  startDate: null,
                  endDate: null,
                  search: "",
                  needsAttention: null,
                })
              }
            >
              Tozalash
            </Button>

            <Button icon={<DownloadOutlined />} type="primary">
              Excel yuklab olish
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <Table
            dataSource={resultsData}
            columns={columns}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              current: pagination.page || 1,
              pageSize: 50,
              total: pagination.total || 0,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} / ${total} ta natija`,
              onChange: (page, pageSize) => {
                setFilters({ ...filters, page, limit: pageSize });
              },
            }}
            rowClassName={(record) =>
              record.needsAttention && !record.isReviewed ? "bg-red-50" : ""
            }
            scroll={{ x: 1200 }}
          />
        </Card>
      </motion.div>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined />
            Test natijasi batafsil
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedResult && (
          <div className="space-y-4">
            <Descriptions bordered>
              <Descriptions.Item label="Talaba">
                {selectedResult.student?.full_name}
              </Descriptions.Item>
              <Descriptions.Item label="Student ID">
                {selectedResult.student?.student_id_number}
              </Descriptions.Item>
              <Descriptions.Item label="Test">
                {selectedResult.test?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Fakultet">
                {selectedResult.department?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Guruh">
                {selectedResult.group?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Topshirgan sana">
                {new Date(selectedResult.completedAt).toLocaleString("uz-UZ")}
              </Descriptions.Item>
            </Descriptions>

            {selectedResult.scores && (
              <Card title="Natijalar" size="small">
                {selectedResult.scores.total !== undefined && (
                  <div className="mb-3">
                    <span className="text-gray-600">Jami ball:</span>
                    <div className="flex items-center gap-4">
                      <Progress
                        percent={Math.min(
                          (selectedResult.scores.total / 100) * 100,
                          100
                        )}
                        format={() => `${selectedResult.scores.total}`}
                      />
                    </div>
                  </div>
                )}

                {selectedResult.scores.categories && (
                  <div>
                    <div className="text-gray-600 mb-2">
                      Kategoriyalar bo'yicha:
                    </div>
                    {Object.entries(selectedResult.scores.categories).map(
                      ([category, score]) => (
                        <div key={category} className="mb-2">
                          <div className="flex justify-between">
                            <span className="capitalize">{category}:</span>
                            <span>{score}</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </Card>
            )}

            <Card title="Tahlil" size="small">
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Daraja:</span>
                  <Tag
                    color={getSeverityColor(
                      selectedResult.interpretation?.severity
                    )}
                    className="ml-2"
                  >
                    {selectedResult.interpretation?.level}
                  </Tag>
                </div>
                <div>
                  <span className="text-gray-600">Tavsif:</span>
                  <p className="mt-1">
                    {selectedResult.interpretation?.description}
                  </p>
                </div>
                {selectedResult.adminNotes && (
                  <div>
                    <span className="text-gray-600">Admin izohi:</span>
                    <p className="mt-1 bg-gray-50 p-2 rounded">
                      {selectedResult.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DetailedResults;
