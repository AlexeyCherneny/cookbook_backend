import { Router } from 'express';

import * as UserController from './controller';

const routes = new Router();

routes.post('/users/auth0', UserController.loginWithAuth0);
routes.post('/users/:userId/categories', UserController.createUserCategory);
routes.get('/users/:userId/categories', UserController.getUserCategories);
routes.delete('/users/:userId/categories', UserController.deleteUserCategory);
routes.get('/users/:userId', UserController.getUserInfo);

export default routes;
