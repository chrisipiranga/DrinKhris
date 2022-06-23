import Form from "react-bootstrap/esm/Form";

const Switch = ({ setShowInventory, showInventory }) => {
  return (
    <div>
      <Form.Check
        type="switch"
        inline
        id="open-inventory"
        defaultValue={showInventory}
        checked={showInventory}
        label={
          <div className="w-100">
            Open <span className="text-gold">Inventory</span>?
          </div>
        }
        onChange={() => {
          setShowInventory(!showInventory);
        }}
        className="font-size-14 mt-2 text-nowrap text-lightgray me-0"
      />
    </div>
  );
};

export default Switch;
