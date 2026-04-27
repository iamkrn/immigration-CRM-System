

exports.getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user   // jo auth middleware se aata hai
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};