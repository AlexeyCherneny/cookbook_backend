import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    fullName: String,
    avatar: String,
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    providerData: {
      uid: String,
      provider: String,
    },
  },
  { timestamps: true }
);

UserSchema.statics.findOrCreate = async function(args) {
  try {
    const user = await this.findOne({ email: args.email, fullName: args.fullName });

    if (!user) {
      return await this.create(args);
    }

    return user;
  } catch (err) {
    return err;
  }
};

UserSchema.statics.addCategory = async function(id, args) {
  const Category = mongoose.model('Category');

  const category = await new Category({ ...args, user: id });

  const user = await this.findByIdAndUpdate(id, {
    $push: { categories: category.id },
  });

  return {
    category: await category.save(),
    user: user._id,
  };
};

UserSchema.statics.deleteCategory = async function(userId, args) {
  let user = await this.findByIdAndUpdate(userId, {
    $pull: { categories: { $in: [args.categoryId] } },
  });

  await user.save();

  user = await this.findById(userId);

  return {
    user,
    categoryIds: user.categories,
    categoryId: args.categoryId,
  };
};

export default mongoose.model('User', UserSchema);
