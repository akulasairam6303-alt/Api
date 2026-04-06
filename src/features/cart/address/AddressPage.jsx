import { useSelector, useDispatch } from "react-redux";
import {
  addAddress,
  deleteAddress,
  selectAddress,
  updateAddress
} from "./addressSlice";
import {
  incrementQuantity,
  decrementQuantity
} from "../cartSlice";
import {
  selectCartArray,
  selectCartTotalPrice
} from "../cartSelectors";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./address.css";

function AddressPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addresses, selectedAddressId } = useSelector(
    state => state.address
  );

  const cartItems = useSelector(selectCartArray);
  const total = useSelector(selectCartTotalPrice);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    altPhone: "",
    flat: "",
    area: "",
    city: "",
    district: "",
    pincode: "",
    state: "",
    type: "Home"
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // 🔥 FIX: convert string → fields
  const parseAddress = (address) => {
    const parts = address.split(",");

    return {
      flat: parts[0]?.trim() || "",
      area: parts[1]?.trim() || "",
      city: parts[2]?.trim() || "",
      district: parts[3]?.trim() || "",
      state: parts[4]?.split("-")[0]?.trim() || "",
      pincode: parts[4]?.split("-")[1]?.trim() || ""
    };
  };

  const handleSave = () => {
    if (!form.name || !form.phone || !form.area || !form.city) {
      alert("Fill required fields");
      return;
    }

    const addressData = {
      name: form.name,
      phone: form.phone,
      address: `${form.flat}, ${form.area}, ${form.city}, ${form.district}, ${form.state} - ${form.pincode}`,
      type: form.type
    };

    if (editId) {
      dispatch(
        updateAddress({
          id: editId,
          ...addressData
        })
      );
      setEditId(null);
    } else {
      dispatch(addAddress(addressData));
    }

    setForm({
      name: "",
      phone: "",
      altPhone: "",
      flat: "",
      area: "",
      city: "",
      district: "",
      pincode: "",
      state: "",
      type: "Home"
    });
  };

  return (
    <div className="address-page">

      <div className="nav-top">
        <button onClick={() => navigate("/cart")}>
          Back to CartPage
        </button>
      </div>

      <h2 className="page-title">
        {editId ? "Edit Address" : "Add New Address"}
      </h2>

      <div className="address-card-ui">

        <input
          placeholder="Full Name *"
          value={form.name}
          onChange={e => handleChange("name", e.target.value)}
        />

        <input
          placeholder="Phone Number *"
          value={form.phone}
          onChange={e => handleChange("phone", e.target.value)}
        />

        <input
          placeholder="Alternate Phone"
          value={form.altPhone}
          onChange={e => handleChange("altPhone", e.target.value)}
        />

        <input
          placeholder="Flat / House No"
          value={form.flat}
          onChange={e => handleChange("flat", e.target.value)}
        />

        <input
          placeholder="Area / Street"
          value={form.area}
          onChange={e => handleChange("area", e.target.value)}
        />

        <div className="row">
          <input
            placeholder="City"
            value={form.city}
            onChange={e => handleChange("city", e.target.value)}
          />
          <input
            placeholder="Pincode"
            value={form.pincode}
            onChange={e => handleChange("pincode", e.target.value)}
          />
        </div>

        <div className="row">
          <input
            placeholder="District"
            value={form.district}
            onChange={e => handleChange("district", e.target.value)}
          />
          <input
            placeholder="State"
            value={form.state}
            onChange={e => handleChange("state", e.target.value)}
          />
        </div>

        <div className="type-buttons">
          {["Home", "Office", "Other"].map(type => (
            <button
              key={type}
              type="button"
              className={form.type === type ? "active-type" : ""}
              onClick={() => handleChange("type", type)}
            >
              {type}
            </button>
          ))}
        </div>

        <button className="save-btn" onClick={handleSave}>
          {editId ? "Update Address" : "Save Address"}
        </button>
      </div>

      <h3 className="saved-title">Saved Addresses</h3>

      {addresses.map(addr => (
        <div key={addr.id} className="saved-card">

          <input
            type="radio"
            checked={selectedAddressId === addr.id}
            onChange={() => dispatch(selectAddress(addr.id))}
          />

          <div>
            <p><strong>{addr.name}</strong> ({addr.type})</p>
            <p>{addr.address}</p>
            <p>{addr.phone}</p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => {
                const parsed = parseAddress(addr.address);

                setEditId(addr.id);
                setForm({
                  name: addr.name,
                  phone: addr.phone,
                  altPhone: "",
                  ...parsed,
                  type: addr.type
                });
              }}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => dispatch(deleteAddress(addr.id))}
            >
              Delete
            </button>
          </div>

        </div>
      ))}

      <div className="order-summary">
        <h3>Order Summary</h3>

        {cartItems.map(item => (
          <div key={item.id} className="order-item">
            <div>
              <p>{item.title}</p>
              <p>₹ {item.price}</p>
            </div>

            <div className="qty-controls">
              <button onClick={() => dispatch(decrementQuantity(item.id))}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
            </div>
          </div>
        ))}

        <h3 className="total">Total: ₹ {total.toFixed(2)}</h3>
      </div>

      <button
        className="save-btn continue-btn"
        onClick={() => navigate("/payment")}
      >
        Continue to Payment
      </button>

    </div>
  );
}

export default AddressPage;