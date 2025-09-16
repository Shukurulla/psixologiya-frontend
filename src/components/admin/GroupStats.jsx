import React, { useState } from "react";
import { Card, Table, Tag, Progress, Select, Spin, Input } from "antd";
import { TeamOutlined, SearchOutlined, BookOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "../../services/api";

const { Option } = Select;

const GroupStats = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchText, setSearchText] = useState("");

  const { data: faculties } = useQuery({
    queryKey: ["facultyList"],
    queryFn: adminAPI.getFaculties,
  });

  const { data: groups, isLoading } = useQuery({
    queryKey: ["groupStats", selectedDepartment],
    queryFn: () => adminAPI.getGroups({ department: selectedDepartment }),
    enabled: true,
  });

  const filteredGroups =
    groups?.data?.filter((group) =>
      group.name.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

  const columns = [
    {
      title: "Guruh nomi",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">
            {record.level} | {record.educationLang}
          </div>
        </div>
      ),
    },
    {
      title: "Fakultet",
      dataIndex: "department",
      key: "department",
      render: (dept) => <Tag color="blue">{dept}</Tag>,
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
      render: (percent) => {
        const color =
          percent >= 75 ? "success" : percent >= 50 ? "normal" : "exception";
        return (
          <Progress percent={Math.round(percent)} size="small" status={color} />
        );
      },
      sorter: (a, b) => a.averageCompletion - b.averageCompletion,
    },
    {
      title: "Holat",
      key: "status",
      render: (_, record) => {
        if (record.averageCompletion >= 75) {
          return <Tag color="success">Yaxshi</Tag>;
        } else if (record.averageCompletion >= 50) {
          return <Tag color="warning">O'rtacha</Tag>;
        }
        return <Tag color="error">Past</Tag>;
      },
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
        <h2 className="text-2xl font-bold mb-2">Guruhlar statistikasi</h2>
        <p className="text-gray-600">
          Barcha guruhlar bo'yicha test topshirish ko'rsatkichlari
        </p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              placeholder="Fakultetni tanlang"
              allowClear
              style={{ width: 300 }}
              onChange={setSelectedDepartment}
              value={selectedDepartment}
            >
              {faculties?.data?.map((faculty) => (
                <Option key={faculty.name} value={faculty.name}>
                  {faculty.name}
                </Option>
              ))}
            </Select>

            <Input
              placeholder="Guruh nomi bo'yicha qidirish..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              style={{ width: 300 }}
            />
          </div>
        </Card>
      </motion.div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="text-gray-600 text-sm mb-1">Jami guruhlar</div>
              <div className="text-2xl font-bold">{filteredGroups.length}</div>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="text-gray-600 text-sm mb-1">Jami talabalar</div>
              <div className="text-2xl font-bold">
                {filteredGroups.reduce((sum, g) => sum + g.studentCount, 0)}
              </div>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="text-gray-600 text-sm mb-1">
                O'rtacha bajarilish
              </div>
              <div className="text-2xl font-bold">
                {filteredGroups.length > 0
                  ? Math.round(
                      filteredGroups.reduce(
                        (sum, g) => sum + g.averageCompletion,
                        0
                      ) / filteredGroups.length
                    )
                  : 0}
                %
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Groups Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <Table
            dataSource={filteredGroups}
            columns={columns}
            rowKey="_id"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `Jami ${total} ta guruh`,
            }}
            locale={{
              emptyText: "Guruhlar topilmadi",
            }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

const { Row, Col } = {
  Row: ({ children, gutter, className }) => (
    <div
      className={`grid grid-cols-12 gap-${gutter?.[0] || 4} ${className || ""}`}
    >
      {children}
    </div>
  ),
  Col: ({ children, xs = 24, sm, md, lg, className }) => {
    const getColClass = () => {
      let classes = "col-span-12";
      if (xs === 24) classes = "col-span-12";
      else if (xs === 12) classes = "col-span-6";
      else if (xs === 8) classes = "col-span-4";

      if (sm === 8) classes += " sm:col-span-4";
      else if (sm === 12) classes += " sm:col-span-6";

      if (md === 6) classes += " md:col-span-3";
      if (lg === 6) classes += " lg:col-span-3";

      return classes;
    };

    return (
      <div className={`${getColClass()} ${className || ""}`}>{children}</div>
    );
  },
};

export default GroupStats;
