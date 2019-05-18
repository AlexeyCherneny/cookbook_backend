import express from 'express';
import dbConfig from './config/db';
import middleWaresConfig from './config/middlewares';
import { RecipeRoutes, CategoriesRoutes, UserRoutes } from './modules';

const app = express();
dbConfig();
middleWaresConfig(app);

app.use('/api', [RecipeRoutes, CategoriesRoutes, UserRoutes]);

const PORT = process.env.PORT || 8081;

app.listen(PORT, err => {
  if (err) {
    console.log('Error: ', err);
  } else {
    console.log(`App is listening port: ${PORT}`);
  }
});
