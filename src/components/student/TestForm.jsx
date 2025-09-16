import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Radio,
  Button,
  Progress,
  message,
  Modal,
  Spin,
  Alert,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { testAPI } from "../../services/api";

const TestForm = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { data: test, isLoading } = useQuery({
    queryKey: ["test", testId],
    queryFn: () => testAPI.getTest(testId),
  });

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [test.data.questions[currentQuestion].id]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestion < test.data.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const unanswered = test.data.questions.filter((q) => !answers[q.id]);

    if (unanswered.length > 0) {
      message.warning(
        `Iltimos, barcha savollarga javob bering! ${unanswered.length} ta savol javobsiz`
      );
      return;
    }

    Modal.confirm({
      title: "Testni topshirish",
      icon: <ExclamationCircleOutlined />,
      content: "Barcha javoblaringiz saqlansa\nadi. Davom etmoqchimisiz?",
      okText: "Ha, topshirish",
      cancelText: "Bekor qilish",
      onOk: submitTest,
    });
  };

  const submitTest = async () => {
    try {
      setSubmitting(true);

      const formattedAnswers = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId: parseInt(questionId),
          answer: answer,
        })
      );

      const response = await testAPI.submitTest(testId, formattedAnswers);

      if (response.success) {
        message.success("Test muvaffaqiyatli topshirildi!");

        if (response.result && !test.data.isSensitive) {
          Modal.success({
            title: "Test natijasi",
            content: (
              <div>
                <p>
                  <strong>Daraja:</strong>{" "}
                  {response.result.interpretation.level}
                </p>
                <p>{response.result.interpretation.description}</p>
              </div>
            ),
            onOk: () => navigate("/student/tests"),
          });
        } else {
          navigate("/student/tests");
        }
      }
    } catch (error) {
      message.error(error?.error || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!test?.data) {
    return <Alert message="Test topilmadi" type="error" />;
  }

  const question = test.data.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.data.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{test.data.name}</h2>
          <p className="text-gray-600 mb-4">{test.data.instruction}</p>
          <Progress
            percent={Math.round(progress)}
            status="active"
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
          />
          <p className="text-center mt-2 text-gray-600">
            Savol {currentQuestion + 1} / {test.data.questions.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">{question.text}</h3>

              <Radio.Group
                value={answers[question.id]}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full"
              >
                <Space direction="vertical" className="w-full">
                  {question.options.map((option) => (
                    <motion.div
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Radio
                        value={option.value}
                        className="w-full p-3 hover:bg-white rounded-lg transition-colors"
                      >
                        {option.label}
                      </Radio>
                    </motion.div>
                  ))}
                </Space>
              </Radio.Group>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Oldingi
          </Button>

          {currentQuestion === test.data.questions.length - 1 ? (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleSubmit}
              loading={submitting}
            >
              Topshirish
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={handleNext}
              disabled={!answers[question.id]}
            >
              Keyingi
            </Button>
          )}
        </div>
      </Card>

      {/* Question Navigation */}
      <Card>
        <h4 className="font-semibold mb-3">Savollar navigatsiyasi</h4>
        <div className="grid grid-cols-10 gap-2">
          {test.data.questions.map((q, index) => (
            <Button
              key={q.id}
              type={answers[q.id] ? "primary" : "default"}
              className={
                currentQuestion === index ? "ring-2 ring-blue-500" : ""
              }
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TestForm;
