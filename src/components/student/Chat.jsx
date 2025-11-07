import { useState, useEffect, useRef } from "react";
import { Card, Input, Button, Empty, Spin, Avatar, message } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import api from "../../services/api";

const { TextArea } = Input;

const Chat = () => {
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChat = async () => {
    try {
      const response = await api.get("/chat");
      setChat(response.data);

      // Mark messages as read
      if (response.data?.messages?.some(msg => msg.sender === "psychologist" && !msg.read)) {
        await api.patch("/chat/read");
      }
    } catch (error) {
      console.error("Chat yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim()) return;

    setSending(true);
    try {
      const response = await api.post("/chat/message", {
        message: messageText.trim(),
      });
      setChat(response.data);
      setMessageText("");
      message.success("Xabar yuborildi");
    } catch (error) {
      message.error("Xabar yuborishda xatolik");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4">
      <Card
        title={
          <div className="flex items-center space-x-3">
            <Avatar icon={<UserOutlined />} className="bg-purple-500" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-0">Psixolog bilan suhbat</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-0">
                Savollaringizni yozing, psixolog tez orada javob beradi
              </p>
            </div>
          </div>
        }
        className="shadow-lg"
      >
        {/* Messages Container */}
        <div
          className="space-y-3 mb-4 overflow-y-auto"
          style={{ maxHeight: "500px", minHeight: "300px" }}
        >
          {!chat?.messages || chat.messages.length === 0 ? (
            <Empty
              description="Hozircha xabarlar yo'q"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <AnimatePresence>
              {chat.messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${
                    msg.sender === "student" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                      msg.sender === "student"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm sm:text-base mb-1 break-words">
                      {msg.message}
                    </p>
                    <p
                      className={`text-xs ${
                        msg.sender === "student"
                          ? "text-purple-100"
                          : "text-gray-500"
                      }`}
                    >
                      {format(new Date(msg.timestamp), "HH:mm, dd MMM", {
                        locale: uz,
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <TextArea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onPressEnter={(e) => {
              if (e.shiftKey) return;
              e.preventDefault();
              handleSend();
            }}
            placeholder="Xabaringizni yozing..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="flex-1"
            disabled={sending}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={sending}
            disabled={!messageText.trim()}
            size="large"
            className="bg-purple-500 hover:bg-purple-600"
          >
            <span className="hidden sm:inline">Yuborish</span>
          </Button>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs sm:text-sm text-blue-700">
            💡 Psixolog ishchi kunlarda 09:00 - 18:00 oralig'ida javob beradi.
            Shoshilinch hollarda qabulga yozilishingiz mumkin.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
