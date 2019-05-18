import Router from 'express';
import * as CategoriesController from './controller';

const routes = new Router();

routes.post('/categories/new', CategoriesController.createCategory);
routes.post('/categories/:categoryId/recipes/new', CategoriesController.createCategoryRecipe);
routes.post('/categories/:categoryId/update', CategoriesController.updateCategory);
routes.get('/categories/:categoryId/recipes', CategoriesController.getCategoryRecipes);
routes.delete('/categories/:categoryId/recipes', CategoriesController.deleteCategoryRecipe);

export default routes;
