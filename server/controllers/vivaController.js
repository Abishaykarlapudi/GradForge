const VivaSession = require('../models/VivaSession');
const aiService = require('../services/aiService');

exports.startViva = async (req, res, next) => {
  try {
    const { projectTitle, description } = req.body;

    if (!projectTitle) {
      return res.status(400).json({ success: false, message: 'Project title is required to mock Viva' });
    }

    const aiQuestions = await aiService.generateVivaQuestions(projectTitle, description || '');

    const questions = aiQuestions.map(q => ({
      question: q.question,
      correctAnswer: q.correctAnswer,
      studentAnswer: '',
      feedback: '',
      isCorrect: false
    }));

    const session = await VivaSession.create({
      userId: req.user._id,
      projectTitle,
      questions,
      score: 0
    });

    // Strip out correctAnswer when returning questions to client
    const clientQuestions = session.questions.map(q => ({
      _id: q._id,
      question: q.question
    }));

    res.status(201).json({
      success: true,
      sessionId: session._id,
      questions: clientQuestions
    });
  } catch (error) {
    next(error);
  }
};

exports.submitVivaAnswers = async (req, res, next) => {
  try {
    const { sessionId, answers } = req.body; // answers is an array: [{ questionId, answer }]

    if (!sessionId || !answers) {
      return res.status(400).json({ success: false, message: 'Session ID and answers are required' });
    }

    const session = await VivaSession.findOne({ _id: sessionId, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Viva Session not found' });
    }

    let totalScore = 0;

    for (let ans of answers) {
      const qIndex = session.questions.findIndex(q => q._id.toString() === ans.questionId);
      if (qIndex !== -1) {
        const questionObj = session.questions[qIndex];
        const evaluation = await aiService.evaluateVivaAnswer(
          questionObj.question,
          ans.answer,
          questionObj.correctAnswer
        );

        questionObj.studentAnswer = ans.answer;
        questionObj.feedback = evaluation.feedback || '';
        questionObj.isCorrect = evaluation.isCorrect || false;
        totalScore += evaluation.score || 0;
      }
    }

    session.score = Math.round((totalScore / (session.questions.length * 10)) * 100);
    await session.save();

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

exports.getMyVivaSessions = async (req, res, next) => {
  try {
    const sessions = await VivaSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, sessions });
  } catch (error) {
    next(error);
  }
};
