const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const auth = require('./auth');

// 设置数据库文件的路径
const dbPath = path.resolve(__dirname, '../db.sqlite');
const db = new sqlite3.Database(dbPath);

// 初始化数据库，创建表格（如果表不存在）
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL
    )
  `);
});

// 获取用户 Profile
function getProfile() {
  const { address } = auth.wallet;
  return new Promise((resolve, reject) => {
    // 使用参数化查询防止 SQL 注入
    db.get('SELECT * FROM profiles WHERE address = ?', [address], (err, row) => {
      if (err) {
        return reject(err);
      }
      return resolve(row);
    });
  });
}

// 更新用户 Profile
function updateProfile({ id, data }) {
  const { username, email, phone } = data;
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE profiles SET username = ?, email = ?, phone = ? WHERE id = ?',
      [username, email, phone, id],
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve({ message: 'Profile updated successfully' });
      },
    );
  });
}

// 创建用户 Profile
function createProfile({ username, email, phone }) {
  const { address } = auth.wallet;
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO profiles (username, email, phone, address) VALUES (?, ?, ?,?)',
      [username, email, phone, address],
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve({ message: 'Profile created successfully', id: this.lastID });
      },
    );
  });
}

module.exports = {
  getProfile,
  updateProfile,
  createProfile,
};
