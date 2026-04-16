import { useSelector, useDispatch } from "react-redux";
import { deleteAddress, selectAddress } from "./addressSlice";
import { selectCartArray, selectCartTotalPrice } from "../cart/cartSelectors";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import StepHeader from "../StepHeader/StepHeader";
import "./address.css";

function AddressPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const groupName = "address-group";

  const { addresses, selectedAddressId } = useSelector(
    state => state.address
  );

  const selected = addresses.find(a => a.id === selectedAddressId);

  const cartItems = useSelector(selectCartArray);
  const totalPrice = useSelector(selectCartTotalPrice);

  const discount = Math.round(totalPrice * 0.5);
  const platformFee = totalPrice > 500 ? 0 : 40;
  const finalTotal = totalPrice - discount + platformFee;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  const [showPopup, setShowPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowPopup(true);
  };

  const handleConfirm = () => {
    dispatch(deleteAddress(deleteId));
    setShowPopup(false);
    setDeleteId(null);
  };

  const handleCancel = () => {
    setShowPopup(false);
    setDeleteId(null);
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    if (typeof addr === "string") return addr;

    return `${addr.flat}, ${addr.area}, ${addr.city}, ${addr.district}, ${addr.state} - ${addr.pincode}${addr.landmark ? ", " + addr.landmark : ""}`;
  };

  return (
    <div className="cart-container">

      <StepHeader currentStep={2} />

      <div className="checkout-container">

        <div className="address-section">

          <div className="address-header">
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button className="back-btn" onClick={() => navigate("/cart")}>
                BACK TO CART
              </button>
              <h3>Select Delivery Address</h3>
            </div>

            <button onClick={() => navigate("/add-address")}>
              ADD NEW ADDRESS
            </button>
          </div>

          {addresses.map(addr => (
            <div
              key={addr.id}
              className={`address-card ${
                selectedAddressId === addr.id ? "selected" : ""
              }`}
            >
              <div className="radio-box">
                <input
                  type="radio"
                  name={groupName}
                  checked={selectedAddressId === addr.id}
                  onChange={() => dispatch(selectAddress(addr.id))}
                />
              </div>

              <div className="address-content">

                <div className="name-row">
                  <strong>{addr.name}</strong>
                  <span className="address-type">
                    {addr.type || addr.address?.type || "HOME"}
                  </span>
                </div>

                <p>{formatAddress(addr.address)}</p>
                <p>{addr.phone}</p>

                <div className="address-actions">
                  <button onClick={() => handleDeleteClick(addr.id)}>
                    DELETE
                  </button>

                  <button
                    onClick={() =>
                      navigate("/add-address", { state: { address: addr } })
                    }
                  >
                    EDIT
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>

        <div className="summary-section">

          <h4>ESTIMATED DELIVERY TIME</h4>
          <p className="date">{deliveryDate.toDateString()}</p>

          <div className="price-row">
            <span>Price</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="price-row green">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>

          <div className="price-row">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>

          <hr />

          <div className="total">
            <span>Total Amount</span>
            <span>₹{finalTotal}</span>
          </div>

          <button
            className="continue"
            disabled={!selected || cartItems.length === 0}
            onClick={() => navigate("/payment")}
          >
            Continue
          </button>

        </div>

      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>Do you really want to delete this address?</p>
            <div className="popup-actions">
              <button className="no-btn" onClick={handleCancel}>
                NO
              </button>
              <button className="yes-btn" onClick={handleConfirm}>
                YES
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AddressPage;