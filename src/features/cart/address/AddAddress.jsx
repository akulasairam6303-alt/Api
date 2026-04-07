import { useSelector, useDispatch } from "react-redux";
import { addAddress, updateAddress } from "./addressSlice";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./addAddress.css";

const stateDistrictMap = {
  AP: [
    "Guntur", "Krishna", "Prakasam", "Nellore", "Chittoor",
    "Kadapa", "Kurnool", "Anantapur", "East Godavari", "West Godavari"
  ],
  TG: [
    "Hyderabad", "Rangareddy", "Medchal", "Warangal",
    "Karimnagar", "Nizamabad", "Khammam"
  ],
  KA: [
    "Bangalore Urban", "Bangalore Rural", "Mysore",
    "Mangalore", "Hubli", "Belgaum", "Davangere"
  ]
};

function AddAddressPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { addresses } = useSelector(state => state.address);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    altPhone: "",
    showAlt: false,
    flat: "",
    area: "",
    city: "",
    pincode: "",
    district: "",
    state: "",
    landmark: "",
    showLandmark: false,
    type: "Home"
  });

 useEffect(() => {
  if (!id || addresses.length === 0) return;

  const existing = addresses.find(a => a.id === Number(id));
  if (!existing) return;

  let flat = "", area = "", city = "", district = "", state = "", pincode = "", landmark = "";

  if (typeof existing.address === "string") {
    const parts = existing.address.split(",");

    flat = parts[0]?.trim() || "";
    area = parts[1]?.trim() || "";
    city = parts[2]?.trim() || "";
    district = parts[3]?.trim() || "";

    if (parts[4]) {
      const [st, pin] = parts[4].split("-");
      state = st?.trim() || "";
      pincode = pin?.trim() || "";
    }

    if (parts.length > 5) {
      landmark = parts.slice(5).join(",").trim();
    }

  } else if (typeof existing.address === "object") {
    flat = existing.address.flat || "";
    area = existing.address.area || "";
    city = existing.address.city || "";
    district = existing.address.district || "";
    state = existing.address.state || "";
    pincode = existing.address.pincode || "";
    landmark = existing.address.landmark || "";
  }

  setForm({
    name: existing.name || "",
    phone: existing.phone || "",
    altPhone: "",
    showAlt: false,
    flat,
    area,
    city,
    district,
    state,
    pincode,
    landmark,
    showLandmark: !!landmark,
    type: existing.type || "Home"
  });

}, [id, addresses]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.name || !form.phone || !form.area || !form.city) {
      alert("Fill required fields");
      return;
    }

    const addressData = {
      id: id ? Number(id) : Date.now(),
      name: form.name,
      phone: form.phone,
      address: `${form.flat}, ${form.area}, ${form.city}, ${form.district}, ${form.state} - ${form.pincode}${form.landmark ? ", " + form.landmark : ""}`,
      type: form.type
    };

    if (id) {
      dispatch(updateAddress(addressData));
    } else {
      dispatch(addAddress(addressData));
    }

    navigate("/address");
  };

  return (
    <div className="address-wrapper">
      <div className="address-box">

        <div className="top-bar">
          <button className="back-btn" onClick={() => navigate("/address")}>
            Back
          </button>
        </div>

        <h3 className="title">{id ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}</h3>

        <div className="section">
          <p className="section-title">Contact details</p>

          <input value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="Full Name *" />
          <input value={form.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="Phone Number *" />

          {form.showAlt && (
            <input value={form.altPhone} onChange={e => handleChange("altPhone", e.target.value)} placeholder="Alternate Phone" />
          )}

          <p className="link" onClick={() => handleChange("showAlt", true)}>
            + Add Alternate Phone Number
          </p>
        </div>

        <div className="section">
          <p className="section-title">Address</p>

          <input value={form.flat} onChange={e => handleChange("flat", e.target.value)} placeholder="Flat / House No *" />
          <input value={form.area} onChange={e => handleChange("area", e.target.value)} placeholder="Area / Street *" />
          <input value={form.city} onChange={e => handleChange("city", e.target.value)} placeholder="City *" />
          <input value={form.pincode} onChange={e => handleChange("pincode", e.target.value)} placeholder="Pincode *" />

          <div className="row">

            <select
              value={form.state}
              onChange={e => {
                handleChange("state", e.target.value);
                handleChange("district", "");
              }}
            >
              <option value="">State</option>
              <option value="AP">Andhra Pradesh (AP)</option>
              <option value="TG">Telangana (TG)</option>
              <option value="KA">Karnataka (KA)</option>
            </select>

            <select
              value={form.district}
              onChange={e => handleChange("district", e.target.value)}
              disabled={!form.state}
            >
              <option value="">District</option>
              {form.state &&
                stateDistrictMap[form.state]?.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))
              }
            </select>

          </div>

          {form.showLandmark && (
            <input value={form.landmark} onChange={e => handleChange("landmark", e.target.value)} placeholder="Landmark" />
          )}

          <p className="link" onClick={() => handleChange("showLandmark", true)}>
            + Add Landmark
          </p>
        </div>

        <div className="section">
          <p className="section-title">Address Type</p>

          <div className="type-buttons">
            {["Home", "Office", "Others"].map(type => (
              <button
                key={type}
                className={form.type === type ? "active" : ""}
                onClick={() => handleChange("type", type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <button className="save-btn" onClick={handleSave}>
          {id ? "Update Address" : "Save Address"}
        </button>

      </div>
    </div>
  );
}

export default AddAddressPage;