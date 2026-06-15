const AIChat = require('../models/AIChat');
const aiService = require('../services/aiService');

exports.chat = async (req, res, next) => {
  try {
    const { message, topic, context } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    let chatSession = await AIChat.findOne({ userId: req.user._id, topic: topic || 'General Guidance' });

    if (!chatSession) {
      chatSession = new AIChat({
        userId: req.user._id,
        topic: topic || 'General Guidance',
        messages: []
      });
    }

    // Append student message
    chatSession.messages.push({ sender: 'user', text: message });

    // Call AI helper passing messages and current workspace context
    const aiResponse = await aiService.chatAssistant(chatSession.messages, context || '');

    // Append AI reply
    chatSession.messages.push({ sender: 'ai', text: aiResponse });
    await chatSession.save();

    res.json({ success: true, reply: aiResponse, messages: chatSession.messages });
  } catch (error) {
    next(error);
  }
};

exports.getChats = async (req, res, next) => {
  try {
    const chats = await AIChat.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, chats });
  } catch (error) {
    next(error);
  }
};
