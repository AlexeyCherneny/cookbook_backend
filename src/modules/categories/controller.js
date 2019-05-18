import Category from './model';
import { Recipe } from '../recipes';

export const createCategory = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title must be provided' });
  } else if (typeof title !== 'string') {
    return res.status(400).json({ error: 'Title must be a string' });
  } else if (title.length < 4) {
    return res.status(400).json({ error: 'Title must be at least 4 characters long' });
  }

  const category = new Category({ title });

  try {
    return res.status(201).json({ error: false, group: await category.save() });
  } catch (err) {
    return res.status(400).json({ error: true, message: 'Category couldnt be created' });
  }
};

export const createCategoryRecipe = async (req, res) => {
  const { title, description } = req.body;
  const { categoryId } = req.params;

  if (!title) {
    return res.status(400).json({ error: 'Title must be provided' });
  } else if (typeof title !== 'string') {
    return res.status(400).json({ error: 'Title must be a string' });
  } else if (title.length < 5) {
    return res.status(400).json({ error: 'Title must be at least 5 characters long' });
  }

  if (!description) {
    return res.status(400).json({ error: 'Description must be provided' });
  } else if (typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string' });
  } else if (description.length < 5) {
    return res.status(400).json({ error: 'Description must be at least 5 characters long' });
  }

  if (!categoryId) {
    return res.status(400).json({ error: 'Category id must be a provided' });
  }

  try {
    const { category, recipe } = await Category.addRecipe(categoryId, {
      title,
      description,
    });
    return res.status(201).json({ error: false, category, recipe });
  } catch (err) {
    return res.status(400).json({ error: true, message: 'Recipe can not be created' });
  }
};

// export const getCategoryRecipes = async (req, res) => {
//   const { categoryId } = req.params;
//   if (!categoryId) {
//     return res
//       .status(400)
//       .json({ error: true, message: 'You need to provide a category id' });
//   }

//   const category = await Category.findById(categoryId);

//   if (!category) {
//     return res
//       .status(400)
//       .json({ error: true, message: "Category doesn't exist" });
//   }

//   try {
//     return res.status(200).json({
//       error: false,
//       recipes: await Recipe.find({ category: categoryId }).populate(
//         'category',
//         'title'
//       ),
//     });
//   } catch (err) {
//     return res
//       .status(400)
//       .json({ error: true, message: 'Can not fetch category recipes' });
//   }
// };

export const getCategoryRecipes = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    const recipeIds = category.recipes;

    const recipes = await Recipe.find({ _id: { $in: recipeIds } });

    return res.status(200).json({ recipes });
  } catch (e) {
    return res.status(e.status).json({ error: true, message: 'Error with user categories' });
  }
};

export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { title } = req.body;

  if (!categoryId) {
    return res.status(400).json({ error: true, message: 'You need to provide a category id' });
  }

  const category = await Category.findOneAndUpdate(
    {
      _id: categoryId,
    },
    { $set: { title } }
  );

  if (!category) {
    return res.status(400).json({ error: true, message: "Category doesn't exist" });
  }

  try {
    const updatedCategory = await Category.findById(categoryId);

    return res.status(200).json({
      error: {
        on: false,
        message: '',
      },
      category: updatedCategory,
    });
  } catch (err) {
    return res.status(400).json({ error: true, message: 'Can not fetch category recipes' });
  }
};

export const deleteCategoryRecipe = async (req, res) => {
  const { categoryId } = req.params;
  const { recipeId } = req.body;

  if (!categoryId) {
    return res.status(400).json({ error: 'Category id must be provided' });
  }
  if (!recipeId) {
    return res.status(400).json({ error: 'Recipe id must be provided' });
  }

  try {
    const response = await Category.removeRecipe(categoryId, { recipeId });
    // await Recipe.removeRecipe(recipeId);

    return res.status(200).json({ ...response });
  } catch (e) {
    return res.status(e.status).json({ error: true, message: 'Error with user categories' });
  }
};
