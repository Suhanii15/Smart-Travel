const User=require("../models/UserModel");

const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("notifications");
    return res.json({ 
      success: true, 
      notifications: user.notifications.sort((a, b) => b.createdAt - a.createdAt)
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id, "notifications._id": req.params.notifId },
      { $set: { "notifications.$.read": true } }
    );
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $set: { "notifications.$[].read": true } }
    );
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports={getNotifications, markAsRead, markAllRead}