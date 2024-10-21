const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");


const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")  
      .populate({
        path: "chat",
        populate: { path: "users", select: "name pic email" }  
      });

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Invalid message or chatId" });
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    const message = await Message.create(newMessage);
    const fullMessage = await Message.findById(message._id)
      .populate("sender", "name pic email")
      .populate({
        path: "chat",
        populate: { path: "users", select: "name pic email" }  
      });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: fullMessage });
    res.json(fullMessage);
  } catch (error) {
    res.status(500).json({ message: "Message sending failed" });
  }
});

module.exports = { allMessages, sendMessage };
