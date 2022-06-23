import { useEffect, useState } from "react"
import Container from "react-bootstrap/esm/Container";
import Collapse from "react-bootstrap/esm/Collapse";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { loadLocalStorage } from "./functions/localstorage";

import Inventory from "./components/Inventory"
import Cocktails from "./components/Cocktails"
import Switch from "./components/Switch";

import "./css/App.css"

function App() {
  const [showInventory, setShowInventory] = useState(false);
  const [inventoryList, setInventoryList] = useState([
    {
      alcoholic: false,
      expireDate: "",
      name: "",
      stock: false,
    },
  ]);

  // Loading from local (persistance) and updating hook

  useEffect(() => {
    const inventoryListData = loadLocalStorage();
    setInventoryList(inventoryListData || []);
  }, []);

  return (
    <Container fluid={true} className="p-0">
      <Row className="p-2 mx-0 switch-sticky w-100">
        <Col className="text-center">
          <Switch
            setShowInventory={setShowInventory}
            showInventory={showInventory}
          />
        </Col>
      </Row>
      <Container>
        <Collapse in={showInventory}>
          <Row>
            <Col xs={12} lg={9} xl={6} className="ms-auto me-auto">
              <Inventory
                inventoryList={inventoryList}
                setInventoryList={setInventoryList}
                setShowInventory={setShowInventory}
              />
            </Col>
          </Row>
        </Collapse>
        <Collapse in={!showInventory}>
          <Row>
            <Col xs={12} lg={9} xl={6} className="ms-auto me-auto pb-3">
              <Cocktails
                inventoryList={inventoryList}
                setShowInventory={setShowInventory}
              />
            </Col>
          </Row>
        </Collapse>
      </Container>
    </Container>
  );
}
export default App
