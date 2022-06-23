import { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button"

import { useForm } from "react-hook-form";

import { saveLocalStorage } from "../functions/localstorage";
import todayDate from "../functions/todayDate";
import scrollUp from "../functions/scrollUp";
import api from "../services/api";
import Loading from "./Loading";

function Inventory({ inventoryList, setInventoryList, setShowInventory}) {

  const [ingredients, setIngredients] = useState([]);
  const [stickButton, setStickButton] = useState(false);
  const [erroLoading, setErroLoading] = useState({});
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, getValues, setValue, formState, watch } = useForm();
  const {errors} = formState;

  // Storing local (for persistance) and updating hook based on new update

  const onSubmit = (data) => {
    const ingredients = data.ingredient;
    setInventoryList(ingredients);
    saveLocalStorage(ingredients);
    setShowInventory(false);
    setStickButton(false);
    scrollUp();
  };

  // Fetching Ingredient List on Component Load
  useEffect(() => {
    async function loadIngredients() {
      await api
        .get("/ingredients")
        .then((response) => {
          setIngredients(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setErroLoading({
            alert: "Something went wrong loading API",
            error: error,
          });
        });
    }
    loadIngredients();
  }, []);

  // Loading wait while Fetching data

  if (loading) {
    const messageLoading = "Loading Ingredients List...";
    return <Loading messageLoading={messageLoading} erroLoading={erroLoading} />
  }

  // Rendering default...

  return (
    <Row className="inventory-menu">
      <Col>
        <Row>
          <Col className="text-center logo pb-4">
            <img src={require("../assets/inventory.png")} alt="Cocktail Menu" />
          </Col>
        </Row>
        <Row className="g-0">
          <Col xs={5}>Ingredient</Col>
          <Col xs={2} className="text-center">
            Stock?
          </Col>
          <Col xs={5} className="text-center">
            Expiration date
          </Col>
        </Row>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          {/* Mapping List based on API fetch */}
          {ingredients.map((ingredient, index) => {
            const ingredientItem = inventoryList.filter(
              (ingredientItem) => ingredientItem.name === ingredient.name
            )[0];

            const fieldName = `ingredient[${index}]`;

            // Rendering hook form fields

            return (
              <Row key={index} className="my-3 g-0">
                <input
                  type="hidden"
                  name={`${fieldName}.alcoholic`}
                  value={ingredient.alcoholic}
                  {...register(`${fieldName}.alcoholic`)}
                />
                <input
                  type="hidden"
                  name={`${fieldName}.name`}
                  value={ingredient.name}
                  {...register(`${fieldName}.name`)}
                />
                <Col xs={5} className="mt-2">
                  {ingredient.name}
                </Col>
                <Col xs={2} className="text-center mt-2">
                  <Form.Check
                    type="switch"
                    name={`${fieldName}.stock`}
                    className="align-self-center"
                    label=""
                    onClick={(e) => {
                      setValue(
                        `${fieldName}.expireDate`,
                        e.target.checked ? todayDate : ""
                      );
                      setStickButton(true);
                    }}
                    defaultChecked={ingredientItem && ingredientItem.stock} // Validating existent or new object value
                    {...register(`${fieldName}.stock`)}
                  />
                </Col>
                <Col xs={5} className="text-center">
                  <Form.Group controlId={`${fieldName}.expireDate`}>
                    <Form.Control
                      type="date"
                      readOnly={!watch(`${fieldName}.stock`)}
                      name={`${fieldName}.expireDate`}
                      defaultValue={ingredientItem && ingredientItem.expireDate} // Validating existent or new object value
                      {...register(`${fieldName}.expireDate`, {
                        validate: {
                          required: (value) => {
                            if (!value && getValues(`${fieldName}.stock`))
                              return `a valid Expiration Date is required when ${ingredient.name} is Stocked`; // Custom validation error message
                            return true;
                          },
                        },
                      })}
                      required={false}
                      placeholder="Expiration Date"
                      className={`form-control text-center ${
                        errors.ingredient?.[index]?.expireDate?.message ?
                        "is-invalid" : ""
                      }`}
                      onChange={() => {
                        setStickButton(true);
                      }}
                    />
                    {errors.ingredient?.[index]?.expireDate?.message && (
                      <div className="invalid-feedback font-size-10 text-gold">
                        {errors.ingredient?.[index]?.expireDate?.message}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            );
          })}
          <Row
            className={
              stickButton
                ? "w-100 d-flex py-3 m-0 stick-button"
                : "w-100 d-flex py-3 m-0"
            }
          >
            <Col className="text-center g-0">
              <Button variant="primary" type="submit" className="w-100">
                Save Ingredient Changes
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}

export default Inventory
