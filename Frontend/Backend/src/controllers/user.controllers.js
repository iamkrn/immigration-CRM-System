

exports.getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user   
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};