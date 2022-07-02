
import { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";

import todayDate from "../functions/todayDate";

import Loading from "./Loading";
import api from "../services/api";

function Cocktails({ inventoryList, setShowInventory }) {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroLoading, setErroLoading] = useState({});

  // Fetching Cocktails List on Component Load

  useEffect(() => {
    async function loadCocktails() {
      // Fetching Ingredient List on Component Load

      await api
        .get("/cocktails")
        .then((response) => {
          const sortedList = response.data.sort((a, b) => // Sorting
            a.name > b.name ? 1 : -1
          );

          setCocktails(sortedList);
          setLoading(false);
        })
        .catch((error) => {
          setErroLoading({
            alert: "Something went wrong loading API",
            error: error,
          });
        });
    }

    loadCocktails();
  }, []);

  // Filter only Available and non-expired ingredients

  const availableInventory = inventoryList
    .filter((ingredient) => {
      return ingredient.stock && ingredient.expireDate >= todayDate;
    })
    .map(({ name }) => name.toLowerCase()); // Ignoring Case-Sensitive "White rum" (Ingredient) ==  "White Rum" (Cocktail)

  const alcoholicInventory = inventoryList
    .filter((ingredient) => {
      return ingredient.alcoholic;
    })
    .map(({ name }) => name.toLowerCase()); // Ignoring Case-Sensitive "White rum" (Ingredient) ==  "White Rum" (Cocktail)

  // Loading wait while Fetching data

  if (loading) {
    const messageLoading = "Loading Cocktails List...";
    return (
      <Loading messageLoading={messageLoading} erroLoading={erroLoading} />
    );
  }

  // Rendering default...

  return (
    <div className="cocktail-menu bg-dark shadow">
      <Row>
        <Col className="text-center logo">
          <img src={require("../assets/menu.png")} alt="Loading..." />
        </Col>
      </Row>
      {cocktails.map(
        (cocktail, index) =>
          // Filter only Cocktails that use available and non-expired Ingredients
          cocktail.ingredients.every(
            (ingredient) =>
              availableInventory.includes(ingredient.toLowerCase()) // Ignoring Case-Sensitive "White rum" (Ingredient) ==  "White Rum" (Cocktail)
          ) && (
            <div key={index} className="cocktails px-4 py-3">
              <Row>
                <Col xs={9} className="font-size-20">
                  {index + 1} <span className="text-gold">{cocktail.name}</span>
                </Col>
                <Col xs={3} className="text-end">
                  {cocktail.ingredients.every(
                    (ingredient) =>
                      alcoholicInventory.includes(ingredient.toLowerCase()) // 18+ Alert Info - if contains ALCOHOLIC Ingredient
                  ) && <span className="fw-bold text-gold">18+</span>}
                  <br />
                </Col>
                <Col xs={12} className="font-size-12">
                  Ingredients:
                  <ul className="ingredient-list ms-1">
                    {cocktail.ingredients.map(
                      (
                        item,
                        index // ingredients splitting
                      ) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </Col>
              </Row>
            </div>
          )
      )}
      <Row className="p-4 no-cocktails">
        <Col className="text-center">
          <h2 className="text-gold">Ohhhh noooooo!</h2>
          <span className="d-block">no ingredients available!</span>
          <span className="d-block mb-5 font-size-24">Party's over?</span>
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            onClick={() => setShowInventory(true)}
          >
            Update Inventory
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Cocktails;
