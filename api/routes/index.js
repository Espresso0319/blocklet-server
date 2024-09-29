const middleware = require('@blocklet/sdk/lib/middlewares');
const router = require('express').Router();
const express = require('express');

// 模拟的用户 profile 数据（可以替换为数据库或其他数据源）
let userProfile = {
  username: 'JohnDoe',
  email: 'johndoe@example.com',
  phone: '123-456-7890',
};

// 获取当前登录用户信息
router.use('/user', middleware.user(), (req, res) => res.json(req.user || {}));

// 现有的 /data 接口
router.use('/data', (req, res) =>
  res.json({
    message: 'Hello A!',
  }),
);

// 新增的 /profile 接口，用来返回用户 profile 信息
router.get('/profile', (req, res) => {
  res.json(userProfile);
});

// 新增的 PUT /profile 接口，用来更新用户 profile 信息
router.put('/profile', express.json(), (req, res) => {
  const { username, email, phone } = req.body;

  // 校验请求体的字段是否有效
  if (!username || !email || !phone) {
    return res.status(400).json({ error: 'All fields (username, email, phone) are required.' });
  }

  // 更新用户 profile 数据（这里直接更新内存中的数据，可以替换为数据库更新逻辑）
  userProfile = {
    username,
    email,
    phone,
  };

  return res.json({
    message: 'Profile updated successfully!',
    profile: userProfile,
  });
});

module.exports = router;
