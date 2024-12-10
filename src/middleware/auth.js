const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Silakan login terlebih dahulu' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      message: 'Token tidak valid' 
    });
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 1) {
      return res.status(403).json({
        message: 'Akses ditolak. Anda tidak memiliki izin.'
      });
    }
    next();
  } catch (error) {
    res.status(403).json({
      message: 'Terjadi kesalahan saat verifikasi role'
    });
  }
};

module.exports = { auth, checkAdmin };
