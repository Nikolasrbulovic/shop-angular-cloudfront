"use strict";
const products = [
  {
    id: "1",
    title: "Product 1",
    description: "Description for Product 1",
    price: 100,
    count: 10,
  },
  {
    id: "2",
    title: "Product 2",
    description: "Description for Product 2",
    price: 200,
    count: 20,
  },
  {
    id: "3",
    title: "Product 3",
    description: "Description for Product 3",
    price: 300,
    count: 30,
  },
  {
    id: "4",
    title: "Product 4",
    description: "Description for Product 4",
    price: 400,
    count: 40,
  },
];
export const handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(products),
  };
};
