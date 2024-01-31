const express = require("express");
const app = express();
require("dotenv").config();

const carsData = require("../cars.json");

app.get("/api/cars", (req, res) => {
  res.json(carsData);
});

app.get("/api/cars/:brand", (req, res) => {
  const brand = req.params.brand.toLowerCase();
  const filteredCars = carsData.filter(
    (car) => car.brand.toLowerCase() === brand
  );
  res.json(filteredCars);
});

module.exports = app;
