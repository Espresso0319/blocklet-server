const router = require('express').Router();
const express = require('express');
const profileDb = require('../libs/profile');

// 返回用户 profile 信息
router.get('/profile', async (req, res) => {
  const p = await profileDb.getProfile();

  // 如果用户没有 profile 信息，则创建一个默认的 profile 信息
  res.json(
    p || {
      username: 'JohnDoe',
      email: 'johndoe@example.com',
      phone: '123-456-7890',
    },
  );
});

// 更新用户 profile 信息
router.put('/profile', express.json(), async (req, res) => {
  const { username, email, phone } = req.body;

  // 校验请求体的字段是否有效
  if (!username || !email || !phone) {
    return res.status(400).json({ error: 'All fields (username, email, phone) are required.' });
  }

  const data = { username, email, phone };

  try {
    // 查找数据库中的用户 profile
    const existingProfile = await profileDb.getProfile();

    let result;

    if (existingProfile) {
      // 如果存在则更新 profile
      result = await profileDb.updateProfile({ id: existingProfile.id, data });
    } else {
      // 如果不存在则创建新的 profile
      result = await profileDb.createProfile(data);
    }

    return res.json({
      message: 'Profile updated successfully!',
      result,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Failed to update or create profile' });
  }
});

module.exports = router;
