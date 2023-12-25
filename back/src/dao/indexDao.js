const { pool } = require("../../config/database");

exports.selectRestaurants = async function (connection, category) {
  const selectAllRestaurantsQuery = `SELECT title, address, category, star, pictureURL, review FROM Restaurants where status ='A';`;
  const selectCategorizedRestaurantsQuery = `SELECT title, address, category, star, pictureURL, review FROM Restaurants where status ='A' and category = ?;`;
  
  const Params = [category];

  const Query = category 
  ? selectCategorizedRestaurantsQuery
  : selectAllRestaurantsQuery;

  const rows = await connection.query(Query, Params);

  return rows;
};



exports.insertReview = async function (connection, title, category, address, star, review, pictureURL) {
  const Query = `insert into Restaurants(title, category, address, star, review, pictureURL) values (?, ?, ?, ?, ?, ?);`;
  const Params = [title, category, address, star, review, pictureURL];

  const rows = await connection.query(Query, Params);

  return rows;
};



