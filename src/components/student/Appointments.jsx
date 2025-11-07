import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Empty,
  Spin,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  message,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import api from "../../services/api";
import dayjs from "dayjs";

const { TextArea } = Input;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointment");
      setAppointments(response.data || []);
    } catch (error) {
      console.error("Arizalarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await api.post("/appointment", {
        reason: values.reason,
        description: values.description,
        preferredDate: values.preferredDate
          ? values.preferredDate.format("YYYY-MM-DD")
          : null,
        preferredTime: values.preferredTime
          ? values.preferredTime.format("HH:mm")
          : null,
      });
      message.success("Ariza muvaffaqiyatli yuborildi");
      setShowModal(false);
      form.resetFields();
      fetchAppointments();
    } catch (error) {
      message.error(
        error?.response?.data?.error || "Ariza yuborishda xatolik"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: {
        color: "gold",
        icon: <SyncOutlined spin />,
        text: "Ko'rib chiqilmoqda",
      },
      approved: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Tasdiqlangan",
      },
      rejected: {
        color: "red",
        icon: <CloseCircleOutlined />,
        text: "Rad etilgan",
      },
      completed: {
        color: "blue",
        icon: <CheckCircleOutlined />,
        text: "Yakunlangan",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Tag icon={config.icon} color={config.color}>
        {config.text}
      </Tag>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Psixolog qabuliga yozilish
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Shaxsiy konsultatsiya uchun ariza qoldiring
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowModal(true)}
          size="large"
          className="bg-purple-500 hover:bg-purple-600"
        >
          Yangi ariza
        </Button>
      </div>

      {/* Appointments List */}
      {!appointments || appointments.length === 0 ? (
        <Card>
          <Empty
            description="Hozircha arizalar yo'q"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowModal(true)}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Birinchi ariza yaratish
            </Button>
          </Empty>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="hover:shadow-lg transition-shadow border border-gray-200"
                actions={
                  appointment.status === "approved"
                    ? [
                        <div key="date" className="text-center">
                          <CalendarOutlined className="text-green-500 mr-2" />
                          <span className="text-sm font-medium">
                            {format(
                              new Date(appointment.appointmentDate),
                              "dd MMMM yyyy",
                              { locale: uz }
                            )}
                          </span>
                        </div>,
                        <div key="time" className="text-center">
                          <ClockCircleOutlined className="text-green-500 mr-2" />
                          <span className="text-sm font-medium">
                            {appointment.appointmentTime}
                          </span>
                        </div>,
                      ]
                    : undefined
                }
              >
                <div className="space-y-3">
                  {/* Status and Date */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1">
                        {appointment.reason}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {format(
                          new Date(appointment.createdAt),
                          "dd MMMM yyyy, HH:mm",
                          { locale: uz }
                        )}
                      </p>
                    </div>
                    {getStatusTag(appointment.status)}
                  </div>

                  {/* Description */}
                  {appointment.description && (
                    <p className="text-sm text-gray-700">
                      {appointment.description}
                    </p>
                  )}

                  {/* Preferred Date/Time */}
                  {appointment.preferredDate && (
                    <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarOutlined className="mr-2" />
                        <span>
                          Taklif etilgan sana:{" "}
                          {format(
                            new Date(appointment.preferredDate),
                            "dd MMMM yyyy",
                            { locale: uz }
                          )}
                        </span>
                      </div>
                      {appointment.preferredTime && (
                        <div className="flex items-center">
                          <ClockCircleOutlined className="mr-2" />
                          <span>Vaqt: {appointment.preferredTime}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Psychologist Note */}
                  {appointment.psychologistNote && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs sm:text-sm font-medium text-blue-800 mb-1">
                        Psixolog izohi:
                      </p>
                      <p className="text-xs sm:text-sm text-blue-700">
                        {appointment.psychologistNote}
                      </p>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {appointment.status === "rejected" &&
                    appointment.rejectionReason && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-xs sm:text-sm font-medium text-red-800 mb-1">
                          Rad etilish sababi:
                        </p>
                        <p className="text-xs sm:text-sm text-red-700">
                          {appointment.rejectionReason}
                        </p>
                      </div>
                    )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Appointment Modal */}
      <Modal
        title="Psixolog qabuliga yozilish"
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Murojaat sababi"
            name="reason"
            rules={[{ required: true, message: "Iltimos, sabab kiriting" }]}
          >
            <Input placeholder="Qisqa sabab yozing (masalan: Stress, Depressiya)" />
          </Form.Item>

          <Form.Item label="Batafsil ma'lumot" name="description">
            <TextArea
              rows={4}
              placeholder="Qo'shimcha ma'lumot yozing (ixtiyoriy)"
            />
          </Form.Item>

          <Form.Item
            label="Qulay sana (ixtiyoriy)"
            name="preferredDate"
            help="Sizga qulay sanani tanlang, psixolog imkoniyatini tekshiradi"
          >
            <DatePicker
              className="w-full"
              format="DD.MM.YYYY"
              placeholder="Sanani tanlang"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>

          <Form.Item label="Qulay vaqt (ixtiyoriy)" name="preferredTime">
            <TimePicker
              className="w-full"
              format="HH:mm"
              placeholder="Vaqtni tanlang"
              minuteStep={30}
            />
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setShowModal(false)}>Bekor qilish</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Yuborish
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointments;
