const express = require("express");
const app = express();
require("dotenv").config();

const carsData = require("../cars.json");
const motosData = require("../motos.json");

app.get("/api/cars", (req, res) => {
  const carsWithoutModels = carsData.map(({ brand }) => ({ brand }));

  res.json(carsWithoutModels);
});

app.get("/api/cars/:brand", (req, res) => {
  const brand = req.params.brand.toLowerCase();
  const filteredCars = carsData.filter(
    (car) => car.brand.toLowerCase() === brand
  );
  res.json(filteredCars);
});
app.get("/api/motos", (req, res) => {
  const motosWithoutModels = motosData.map(({ brand }) => ({ brand }));

  res.json(motosWithoutModels);
});

app.get("/api/motos/:brand", (req, res) => {
  const brand = req.params.brand.toLowerCase();
  const filteredMotos = motosData.filter(
    (moto) => moto.brand.toLowerCase() === brand
  );
  res.json(filteredMotos);
});

module.exports = app;
