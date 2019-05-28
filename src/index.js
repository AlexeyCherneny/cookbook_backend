import express from 'express';
import configDB from './config/db';
import configMiddleWares from './config/middleWares';
import { RecipeRoutes, CategoriesRoutes, UserRoutes } from './modules';

const app = express();

configDB();
configMiddleWares(app);

app.use('/api', [RecipeRoutes, CategoriesRoutes, UserRoutes]);

const PORT = process.env.PORT || 8081;

app.listen(PORT, err => {
  if (err) {
    console.log('Error: ', err);
  } else {
    console.log(`App is listening port: ${PORT}`);
  }
});
