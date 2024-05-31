"use strict";
const products = [
  {
    id: 1,
    name: "Product 1",
    price: 29.99,
    description: "Description for product 1",
    imageUrl: "https://example.com/product1.jpg",
  },
  {
    id: 2,
    name: "Product 2",
    price: 49.99,
    description: "Description for product 2",
    imageUrl: "https://example.com/product2.jpg",
  },
  {
    id: 3,
    name: "Product 3",
    price: 19.99,
    description: "Description for product 3",
    imageUrl: "https://example.com/product3.jpg",
  },
];

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(products),
  };
};
