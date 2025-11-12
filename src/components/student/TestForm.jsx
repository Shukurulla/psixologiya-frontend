import { useState } from "react";
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
  Input,
} from "antd";

const { TextArea } = Input;
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
      content: "Barcha javoblaringiz saqlansadi. Davom etmoqchimisiz?",
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

  // Lyusher testi uchun: allaqachon tanlangan ranglarni filtrlaymiz
  const isLuscherTest = test.data.scoringMethod === 'luscher';
  const selectedValues = Object.values(answers);

  // Faqat hozirgi savoldan oldingi javoblarni olamiz
  const previousAnswers = test.data.questions
    .slice(0, currentQuestion)
    .map(q => answers[q.id])
    .filter(Boolean);

  const filteredOptions = isLuscherTest
    ? question.options.filter(option => !previousAnswers.includes(option.value))
    : question.options;

  console.log('Lyusher test:', isLuscherTest);
  console.log('Oldingi javoblar:', previousAnswers);
  console.log('Filtrlangan variantlar:', filteredOptions.length);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      <Card className="mb-3 sm:mb-4">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold mb-2">Test {test.data.order || ''}</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Iltimos, har bir savolga diqqat bilan javob bering. To'g'ri yoki noto'g'ri javob yo'q, faqat sizning fikringiz muhim.
          </p>
          <Progress
            percent={Math.round(progress)}
            status="active"
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
          />
          <p className="text-center mt-2 text-sm sm:text-base text-gray-600">
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
              <h3 className="text-base sm:text-lg font-semibold mb-4">{question.text}</h3>

              {question.image && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={question.image}
                    alt="Savol rasmi"
                    className="max-w-full h-auto rounded-lg border border-gray-300 shadow-md"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              )}

              {test.data.questionType === 'text' ? (
                <TextArea
                  value={answers[question.id]}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder={question.placeholder || "Javobingizni yozing..."}
                  rows={4}
                  className="w-full text-sm sm:text-base"
                  maxLength={500}
                  showCount
                />
              ) : (
                <Radio.Group
                  value={answers[question.id]}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-full"
                >
                  <Space direction="vertical" className="w-full" size="small">
                    {filteredOptions.map((option) => (
                      <motion.div
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                      >
                        <Radio
                          value={option.value}
                          className="w-full p-2 sm:p-3 hover:bg-white rounded-lg transition-colors text-sm sm:text-base"
                        >
                          <div className="flex items-center space-x-3">
                            {option.image && (
                              option.image.startsWith('#') ? (
                                <div
                                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 border-gray-300 shadow-md"
                                  style={{ backgroundColor: option.image }}
                                />
                              ) : (
                                <img
                                  src={option.image}
                                  alt="Variant rasmi"
                                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border border-gray-300"
                                />
                              )
                            )}
                            <span>{option.label}</span>
                          </div>
                        </Radio>
                      </motion.div>
                    ))}
                  </Space>
                </Radio.Group>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-4 sm:mt-6 gap-2">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            size="large"
            className="flex-1 sm:flex-initial"
          >
            <span className="hidden sm:inline">Oldingi</span>
          </Button>

          {currentQuestion === test.data.questions.length - 1 ? (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleSubmit}
              loading={submitting}
              size="large"
              className="flex-1 sm:flex-initial"
            >
              Topshirish
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={handleNext}
              disabled={!answers[question.id]}
              size="large"
              className="flex-1 sm:flex-initial"
            >
              <span className="hidden sm:inline">Keyingi</span>
            </Button>
          )}
        </div>
      </Card>

      {/* Question Navigation */}
      <Card>
        <h4 className="font-semibold mb-3 text-sm sm:text-base">Savollar navigatsiyasi</h4>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {test.data.questions.map((q, index) => (
            <Button
              key={q.id}
              type={answers[q.id] ? "primary" : "default"}
              size="small"
              className={`
                ${currentQuestion === index ? "ring-2 ring-blue-500" : ""}
                text-xs sm:text-sm
              `}
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
