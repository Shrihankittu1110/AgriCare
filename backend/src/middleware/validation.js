export const validateRegister = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Full name is required and must be at least 2 characters long.',
    });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
    });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match.',
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Both email and password are required.',
    });
  }

  next();
};

export const validateChatMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'A non-empty message is required.',
    });
  }

  if (message.length > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Message cannot exceed 2000 characters.',
    });
  }

  next();
};
