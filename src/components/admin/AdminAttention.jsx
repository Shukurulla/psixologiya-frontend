import React, { useState } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Input,
  Select,
  Space,
  Alert,
  Tooltip,
  Badge,
  Descriptions,
  message,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  WarningOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAPI } from "../../services/api";

const { TextArea } = Input;
const { Option } = Select;

const AttentionNeeds = () => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [filters, setFilters] = useState({
    testId: null,
    department: null,
    severity: null,
  });

  const queryClient = useQueryClient();

  // Get attention-needed results
  const { data: results, isLoading } = useQuery({
    queryKey: ["attentionResults", filters],
    queryFn: () =>
      adminAPI.getTestResults({
        needsAttention: "true",
        testId: filters.testId,
        department: filters.department,
      }),
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

  // Review mutation
  const reviewMutation = useMutation({
    mutationFn: ({ resultId, notes }) =>
      adminAPI.reviewTestResult(resultId, { adminNotes: notes }),
    onSuccess: () => {
      message.success("Natija ko'rib chiqildi");
      setReviewModal(false);
      setSelectedResult(null);
      setAdminNotes("");
      queryClient.invalidateQueries(["attentionResults"]);
      queryClient.invalidateQueries(["adminDashboard"]);
    },
    onError: (error) => {
      message.error(error?.error || "Xatolik yuz berdi");
    },
  });

  const handleViewDetails = (record) => {
    setSelectedResult(record);
  };

  const handleStartReview = (record) => {
    setSelectedResult(record);
    setReviewModal(true);
    setAdminNotes(record.adminNotes || "");
  };

  const handleReviewSubmit = () => {
    if (!selectedResult) return;

    reviewMutation.mutate({
      resultId: selectedResult._id,
      notes: adminNotes,
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
        return "blue";
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
          <div className="text-xs text-gray-500">
            {record.department?.name} | {record.group?.name}
          </div>
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
            <Tag color="orange" size="small" className="mt-1">
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
          <Tag color={getSeverityColor(record.interpretation?.severity)}>
            {getSeverityText(record.interpretation?.severity)}
          </Tag>
          <div className="text-sm mt-1">{record.interpretation?.level}</div>
          {record.scores?.total && (
            <div className="text-xs text-gray-500">
              Ball: {record.scores.total}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Sana",
      dataIndex: "completedAt",
      key: "completedAt",
      render: (date) => (
        <div className="flex items-center gap-1">
          <CalendarOutlined className="text-gray-400" />
          <span className="text-sm">
            {new Date(date).toLocaleDateString("uz-UZ")}
          </span>
        </div>
      ),
      sorter: (a, b) => new Date(a.completedAt) - new Date(b.completedAt),
    },
    {
      title: "Holat",
      key: "status",
      render: (_, record) => (
        <div>
          {record.isReviewed ? (
            <Tag color="green" icon={<CheckOutlined />}>
              Ko'rib chiqilgan
            </Tag>
          ) : (
            <Tag color="red" icon={<WarningOutlined />}>
              E'tibor talab
            </Tag>
          )}
          {record.reviewedAt && (
            <div className="text-xs text-gray-500 mt-1">
              {new Date(record.reviewedAt).toLocaleDateString("uz-UZ")}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Batafsil ko'rish">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {!record.isReviewed && (
            <Tooltip title="Ko'rib chiqish">
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                onClick={() => handleStartReview(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const filterData = results?.data?.results || [];
  const unreviewed = filterData.filter((r) => !r.isReviewed);

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              E'tibor talab qiluvchi natijalar
            </h2>
            <p className="text-gray-600">
              Psixologik yordam kerak bo'lishi mumkin bo'lgan test natijalari
            </p>
          </div>
          <Badge count={unreviewed.length} showZero>
            <Button icon={<WarningOutlined />} disabled>
              Ko'rib chiqilmagan natijalar
            </Button>
          </Badge>
        </div>

        {unreviewed.length > 0 && (
          <Alert
            message="Diqqat!"
            description={`${unreviewed.length} ta natija e'tibor talab qilmoqda. Iltimos, ularni ko'rib chiqing.`}
            type="warning"
            showIcon
            className="mb-4"
          />
        )}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="mb-4">
          <Space wrap>
            <Select
              placeholder="Testni tanlang"
              allowClear
              style={{ width: 200 }}
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
              style={{ width: 200 }}
              onChange={(value) =>
                setFilters({ ...filters, department: value })
              }
            >
              {faculties?.data?.map((faculty) => (
                <Option key={faculty.name} value={faculty.name}>
                  {faculty.name}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Og'irlik darajasi"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => setFilters({ ...filters, severity: value })}
            >
              <Option value="severe">Og'ir</Option>
              <Option value="moderate">O'rta</Option>
              <Option value="mild">Yengil</Option>
            </Select>
          </Space>
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
            dataSource={filterData}
            columns={columns}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              showSizeChanger: true,
              showTotal: (total) => `Jami ${total} ta natija`,
              pageSize: 20,
            }}
            rowClassName={(record) => (!record.isReviewed ? "bg-red-50" : "")}
          />
        </Card>
      </motion.div>

      {/* Detail Modal */}
      <Modal
        title="Test natijasi batafsil"
        open={!!selectedResult && !reviewModal}
        onCancel={() => setSelectedResult(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedResult(null)}>
            Yopish
          </Button>,
          !selectedResult?.isReviewed && (
            <Button
              key="review"
              type="primary"
              onClick={() => handleStartReview(selectedResult)}
            >
              Ko'rib chiqish
            </Button>
          ),
        ]}
        width={700}
      >
        {selectedResult && (
          <div>
            <Descriptions bordered column={2}>
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
                {new Date(selectedResult.completedAt).toLocaleDateString(
                  "uz-UZ"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Natija darajasi" span={2}>
                <Tag
                  color={getSeverityColor(
                    selectedResult.interpretation?.severity
                  )}
                >
                  {selectedResult.interpretation?.level}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tavsif" span={2}>
                {selectedResult.interpretation?.description}
              </Descriptions.Item>
              {selectedResult.adminNotes && (
                <Descriptions.Item label="Admin izohi" span={2}>
                  {selectedResult.adminNotes}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined className="text-orange-500" />
            Test natijasini ko'rib chiqish
          </div>
        }
        open={reviewModal}
        onCancel={() => setReviewModal(false)}
        onOk={handleReviewSubmit}
        confirmLoading={reviewMutation.isLoading}
        okText="Ko'rib chiqildi deb belgilash"
        cancelText="Bekor qilish"
      >
        {selectedResult && (
          <div className="space-y-4">
            <Alert
              message="Bu natija e'tibor talab qilmoqda"
              description={`${selectedResult.student?.full_name} talabasining "${selectedResult.test?.name}" test natijasi psixologik yordam kerak bo'lishi mumkinligini ko'rsatmoqda.`}
              type="warning"
              showIcon
            />

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold mb-2">Test natijasi:</h4>
              <p>
                <strong>Daraja:</strong> {selectedResult.interpretation?.level}
              </p>
              <p>
                <strong>Tavsif:</strong>{" "}
                {selectedResult.interpretation?.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin izohi (ixtiyoriy):
              </label>
              <TextArea
                rows={4}
                placeholder="Bu natija bo'yicha qo'shimcha izoh yoki amalga oshirilgan choralar..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AttentionNeeds;
