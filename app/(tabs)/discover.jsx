import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { HfInference } from "@huggingface/inference";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/configs/FirebaseConfig";

const MEMORY_WINDOW_SIZE = 20;
let conversationMemory = [];

// تابع برای شناسایی زمان فعلی
const getTimeOfDay = () => {
  const currentHour = new Date().getHours(); // ساعت فعلی را بگیرید

  if (currentHour >= 5 && currentHour < 12) {
    return "morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Noon";
  } else if (currentHour >= 17 && currentHour < 21) {
    return "evening";
  } else {
    return "night";
  }
};

const currentTime = getTimeOfDay();

// پرامت سیستم
const systemPrompt = `
You are Maya, a chatbot designed to help users with travel, tourism, and leisure-related questions. The current time of day is ${currentTime}.
`;

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const fetchAPIKeyFromFirestore = async () => {
    try {
      const docRef = doc(db, "ApiHGF", "eorOBs1O6i7QVKt2hUxQ");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const apiKeys = docSnap.data();
        setApiKey(apiKeys.apiHUB);
      } else {
        console.error("No API keys document found!");
      }
    } catch (error) {
      console.error("Error fetching API keys:", error.message);
    }
  };

  const client = new HfInference(apiKey);

  const addMessage = (role, content) => ({
    id: new Date().getTime(),
    role,
    content,
  });

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      id: new Date().getTime(),
      text: userInput,
      role: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput("");

    conversationMemory.push(addMessage("user", userInput));

    if (conversationMemory.length > MEMORY_WINDOW_SIZE) {
      conversationMemory = conversationMemory.slice(-MEMORY_WINDOW_SIZE);
    }

    setIsTyping(true);

    const botResponse = await client.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationMemory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.6,
      max_tokens: 1048,
      top_p: 0.9,
    });

    const botReply = botResponse.choices[0].message.content.trim();

    conversationMemory.push(addMessage("assistant", botReply));

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: new Date().getTime(), text: botReply, role: "assistant" },
    ]);
    setIsTyping(false);
  };

  useEffect(() => {
    fetchAPIKeyFromFirestore();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "android" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {messages.length === 0 && (
            <View style={styles.centerTextContainer}>
              <Image
                source={{
                  uri: "https://img.freepik.com/premium-vector/generate-ai-abstract-vector-symbol-artificial-intelligence-colorful-stars-icon_34480-1539.jpg",
                }}
                style={{
                  width: 90,
                  height: 90,
                }}
              />
              <Text style={styles.Brand}>Maya AI</Text>
              <Text style={styles.centerText}>
                Ask me anything about travel, tourism, or leisure. Let’s plan
                your next adventure together!
              </Text>
            </View>
          )}
          <ScrollView
            contentContainerStyle={styles.messagesContainer}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg) => (
              <View key={msg.id}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {msg.role === "assistant" && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={{
                          uri: "https://img.freepik.com/premium-vector/generate-ai-abstract-vector-symbol-artificial-intelligence-colorful-stars-icon_34480-1539.jpg",
                        }}
                        style={styles.avatar}
                      />
                      <Text style={styles.botName}>Maya AI</Text>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.messageContainer,
                    msg.role === "user"
                      ? styles.userMessage
                      : styles.botMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.role === "user" ? styles.userText : styles.botText,
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}
            {isTyping && (
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color="#007bff" />
                <Text style={styles.typingText}>Bot is typing...</Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.inputContainer}>
            <View style={styles.inputWithButton}>
              <TextInput
                style={styles.inputField}
                placeholder="Write your message here...."
                value={userInput}
                onChangeText={setUserInput}
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Image
                  style={{ width: 25, height: 25 }}
                  source={require("@/assets/images/send.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    fontSize: 18,
    padding: 5,
    color: "#999",
    textAlign: "center",
    fontFamily: "Outfit-Medium",
  },
  messagesContainer: {
    padding: 15,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 15,
    borderRadius: 20,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    borderBottomRightRadius: 0,
    marginRight: 5,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
    borderTopLeftRadius: 0,
    marginLeft: 15,
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    fontFamily: "Outfit-Bold",
    color: "#ffffff",
  },
  botText: {
    color: "#000000",
    fontFamily: "Outfit-Bold",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 15,
    marginRight: 10,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  typingText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#007bff",
    fontFamily: "Outfit-Medium",
  },
  inputContainer: {
    padding: 10,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputWithButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "#7777",
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Outfit-Bold",
  },
  sendButton: {
    marginLeft: 10,
  },
  botName: {
    fontSize: 14,
    color: "#888",
    marginLeft: 5,
    fontFamily: "Outfit-Medium",
  },
  Brand: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Outfit-Medium",
  },
});

export default ChatBot;
