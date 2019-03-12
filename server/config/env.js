
if (process.env.NODE_ENV === 'production') {//Heroku set this variable
  process.env.databaseUri = 'mongodb://habitus:habitus123@ds163694.mlab.com:63694/habitus'; // Databse URI and database name
  process.env.databaseName = 'production database: habitus'; // Database name
} else {
  process.env.NODE_ENV = 'development';
  process.env.databaseUri = 'mongodb://localhost:27017/habitus'; // Databse URI and database name
  process.env.databaseName = 'development database: habitus'; // Database name
}
