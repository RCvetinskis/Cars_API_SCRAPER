const puppeteer = require("puppeteer");
const fs = require("fs/promises");
require("dotenv").config();
const url = process.env.SCRAPE_URL_MOTO;
const outputFile = "motos.json";

async function start() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  //   accept cookies
  const acceptCookiesButton = await page.$("#onetrust-accept-btn-handler");
  if (!acceptCookiesButton) console.log("COOKIES NOT ACCEPTED");

  await acceptCookiesButton.click();

  const getInfo = await page.evaluate(() => {
    const triggerInputBrands = document.querySelector("#f_1");

    // open main car brand input select
    if (triggerInputBrands) {
      triggerInputBrands.click();
    } else {
      console.log("Element not found");
    }

    const brandModels = {};

    const inputSelectValues = document.querySelectorAll(
      "#f_1 > div.values-container > div.values > div:not(:first-child)"
    );

    inputSelectValues.forEach((value) => {
      // select each value
      value.click();
      const brandName = value.textContent.trim();

      //   map each model of a brand
      const motoModelValues = Array.from(
        document.querySelectorAll(
          "#f_model_14 > div.values-container > div.values > div:not(:first-child) > div.value-title"
        )
      ).map((modelValue) => modelValue.textContent.trim());

      if (!brandModels[brandName]) {
        brandModels[brandName] = {
          brand: brandName,
          models: motoModelValues,
        };
      } else {
        brandModels[brandName].models.push(...motoModelValues);
      }
    });

    const motos = Object.values(brandModels);

    return motos;
  });

  try {
    await fs.writeFile(outputFile, JSON.stringify(getInfo, null, 2));
    console.log(`Data saved to ${outputFile}`);
  } catch (error) {
    console.error("Error saving data to file:", error.message);
  }

  await browser.close();
}

start();
