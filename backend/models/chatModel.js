const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },       // Name of the chat or group
    isGroupChat: { type: Boolean, default: false }, // Indicates if it's a group chat
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users in the chat
    latestMessage: {                               // Latest message in the chat
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {                                  // Admin of the group (if group chat)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
