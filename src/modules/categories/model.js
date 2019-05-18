import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLegth: [4, 'Title must be at least 4 caracters long'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    recipes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
      },
    ],
  },
  { timestamps: true, usePushEach: true }
);

CategorySchema.statics.addRecipe = async function(id, args) {
  const Recipe = mongoose.model('Recipe');

  const recipe = await new Recipe({ ...args, category: id });

  const category = await this.findByIdAndUpdate(id, {
    $push: { recipes: recipe.id },
  });

  return {
    recipe: await recipe.save(),
    category,
  };
};

CategorySchema.statics.removeRecipe = async function(categoryId, args) {
  const category = await this.findByIdAndUpdate(categoryId, {
    $pull: { recipes: { $in: [args.recipeId] } },
  });

  await category.save();

  const updatedCategory = await this.findById(categoryId);
  // await this.deleteOne(args.recipeId);

  return {
    updatedCategory,
    recipeIds: updatedCategory.recipes,
    recipeId: args.recipeId,
  };
};

export default mongoose.model('Category', CategorySchema);
