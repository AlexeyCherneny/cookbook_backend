import User from './model';
import { createToken } from './utils/createToken';
import { facebookAuth } from './utils/facebookAuth';
import { googleAuth } from './utils/googleAuth';
import Category from '../categories/model';

export const loginWithAuth0 = async (req, res) => {
  const { provider, token } = req.body;

  let userInfo;

  try {
    if (provider === 'google') {
      userInfo = await googleAuth(token);
    } else {
      userInfo = await facebookAuth(token);
    }
  } catch (err) {
    return res.status(400).json({ error: true, errorMessage: err.mesage });
  }

  const user = await User.findOrCreate(userInfo);

  return res.status(200).json({
    success: true,
    user: {
      id: user._id,
      token: `JWT ${createToken(user)}`,
    },
  });
};

export const getUserInfo = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  try {
    return res.status(201).json({ ...user._doc });
  } catch (err) {
    return res.status(400).json({ error: true, message: 'Can not get user' });
  }
};

export const createUserCategory = async (req, res) => {
  const { title } = req.body;
  const { userId } = req.params;

  if (!title) {
    return res.status(400).json({ error: 'Title must be provided' });
  } else if (typeof title !== 'string') {
    return res.status(400).json({ error: 'Title must be a string' });
  } else if (title.length < 5) {
    return res.status(400).json({ error: 'Title must be at least 5 characters long' });
  }

  if (!userId) {
    return res.status(400).json({ error: 'User id must be a provided' });
  }

  try {
    const { user, category } = await User.addCategory(userId, {
      title,
    });

    return res.status(201).json({ error: false, user, category });
  } catch (err) {
    return res.status(400).json({ error: true, message: 'Category can not be created' });
  }
};

export const getUserCategories = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User id must be provided' });
  }

  try {
    const user = await User.findById(userId);
    const categoryIds = user.categories;

    const categories = await Category.find({ _id: { $in: categoryIds } });

    return res.status(200).json({ categories });
  } catch (e) {
    return res.status(e.status).json({ error: true, message: 'Error with user categories' });
  }
};

export const deleteUserCategory = async (req, res) => {
  const { userId } = req.params;
  const { categoryId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User id must be provided' });
  }
  if (!categoryId) {
    return res.status(400).json({ error: 'Category id must be provided' });
  }

  try {
    const response = await User.deleteCategory(userId, { categoryId });

    return res
      .status(200)
      .json({ categoryId: response.categoryId, categoryIds: response.categoryIds });
  } catch (e) {
    return res.status(e.status).json({ error: true, message: 'Error with user categories' });
  }
};
