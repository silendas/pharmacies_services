const { User, Employee, Role } = require('../models');
const bcrypt = require('bcryptjs');
const role = require('../models/role');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Employee,
            attributes: ['id', 'name', 'phone', 'address']
          },
          {
            model: Role,
            attributes: ['id', 'name']
          }
        ],
        attributes: { exclude: ['password'] }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          {
            model: Employee,
            attributes: ['id', 'name', 'phone', 'address']
          },
          {
            model: Role,
            attributes: ['id', 'name']
          }
        ],
        attributes: { exclude: ['password'] }
      });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Pengguna tidak ditemukan' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        await user.update(req.body);
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        await user.destroy();
        res.json({ message: 'User deleted' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ 
          message: 'Username atau password salah' 
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          message: 'password salah' 
        });
      }

      const token = user.generateToken();
      
      res.json({
        message: 'Login berhasil',
        user: {
          id: user.id,
          user: user
        },
        token
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      // Dalam implementasi sederhana, client harus menghapus token
      // Di sisi server kita hanya mengirim response sukses
      res.json({ 
        message: 'Logout berhasil' 
      });
      
      // Untuk implementasi yang lebih aman, Anda bisa menambahkan
      // blacklist token atau menggunakan Redis untuk menyimpan
      // daftar token yang sudah tidak valid
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userController;
