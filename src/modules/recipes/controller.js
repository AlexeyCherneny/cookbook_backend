import Recipe from './model';

export const createRecipe = async (req, res) => {
  const { title, description } = req.body;
  const newRecipe = new Recipe({ title, description });

  try {
    return res.status(201).json({ recipe: await newRecipe.save() });
  } catch (e) {
    return res.status(e.status).json({ error: true, message: 'Error with recipe' });
  }
};

export const getRecipes = async (req, res) => {
  try {
    return res.status(200).json({ recipes: await Recipe.find({}) });
  } catch (e) {
    return res.status(e.status).json({ error: true, message: 'Error with Recipes' });
  }
};

export const updateRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const { title, description } = req.body;

  console.log({ title, description, recipeId });

  if (!recipeId) {
    return res.status(400).json({ error: true, message: 'You need to provide a recipe id' });
  }

  const recipe = await Recipe.findOneAndUpdate(
    {
      _id: recipeId,
    },
    { $set: { title, description } }
  );

  if (!recipe) {
    return res.status(400).json({ error: true, message: "Recipe doesn't exist" });
  }

  try {
    const updatedRecipe = await Recipe.findById(recipeId);

    return res.status(200).json({
      error: {
        on: false,
        message: '',
      },
      recipe: updatedRecipe,
    });
  } catch (err) {
    return res.status(400).json({ error: true, message: 'Can not update recipes' });
  }
};
