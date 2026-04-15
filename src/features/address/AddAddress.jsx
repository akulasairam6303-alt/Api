import { useSelector, useDispatch } from "react-redux";
import { addAddress, updateAddress } from "./addressSlice";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./addAddress.css";

function AddAddressPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const existing = location.state?.address;
  const isEdit = Boolean(existing);

  const { addresses } = useSelector(state => state.address);

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);

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

  }, [existing]);

  const fetchPincode = async (pin) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (data[0].Status === "Success") {
        const post = data[0].PostOffice[0];
        setForm(prev => ({
          ...prev,
          state: post.State,
          district: post.District
        }));
      } else {
        setForm(prev => ({
          ...prev,
          state: "",
          district: ""
        }));
        alert("Pincode not found");
      }
    } catch {
      setForm(prev => ({
        ...prev,
        state: "",
        district: ""
      }));
      alert("Pincode not found");
    }
    setLoading(false);
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));

    if (key === "pincode") {
      if (timer) clearTimeout(timer);

      if (value.length === 6) {
        const newTimer = setTimeout(() => {
          fetchPincode(value);
        }, 500);
        setTimer(newTimer);
      } else {
        setForm(prev => ({ ...prev, state: "", district: "" }));
      }
    }
  };

  const handleSave = () => {
    if (!form.name || !form.phone || !form.area || !form.city) {
      alert("Fill required fields");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      alert("Invalid phone");
      return;
    }

    if (!/^[0-9]{6}$/.test(form.pincode)) {
      alert("Invalid pincode");
      return;
    }

    if (!form.state || !form.district) {
      alert("Invalid pincode");
      return;
    }

    if (form.type === "Home" || form.type === "Work") {
      const exists = addresses.some(a => {
        if (isEdit) {
          return a.type === form.type && a.id !== existing.id;
        }
        return a.type === form.type;
      });

      if (exists) {
        alert(`${form.type} address already exists`);
        return;
      }
    }

    const data = {
      id: isEdit ? existing.id : Date.now(),
      name: form.name,
      phone: form.phone,
      address: `${form.flat}, ${form.area}, ${form.city}, ${form.district}, ${form.state} - ${form.pincode}`,
      type: form.type
    };

    if (isEdit) {
      dispatch(updateAddress(data));
    } else {
      dispatch(addAddress(data));
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

        <h3 className="title">{isEdit ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}</h3>

        <div className="section">
          <p className="section-title">Contact details</p>

          <input
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            placeholder="Full Name *"
          />

          <input
            value={form.phone}
            onChange={e => handleChange("phone", e.target.value)}
            placeholder="Phone Number *"
          />
        </div>

        <div className="section">
          <p className="section-title">Address</p>

          <input
            value={form.flat}
            onChange={e => handleChange("flat", e.target.value)}
            placeholder="Flat / House No *"
          />

          <input
            value={form.area}
            onChange={e => handleChange("area", e.target.value)}
            placeholder="Area / Street *"
          />

          <input
            value={form.city}
            onChange={e => handleChange("city", e.target.value)}
            placeholder="City *"
          />

          <input
            value={form.pincode}
            onChange={e => handleChange("pincode", e.target.value)}
            placeholder="Pincode *"
          />

          {loading && <p>Fetching location...</p>}

          <div className="row">
            <input value={form.state} placeholder="State" readOnly />
            <input value={form.district} placeholder="District" readOnly />
          </div>
        </div>

        <div className="section">
          <p className="section-title">Address Type</p>

          <div className="type-buttons">
            {["Home", "Work", "Others"].map(type => (
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
          {isEdit ? "Update Address" : "Save Address"}
        </button>

      </div>
    </div>
  );
}

export default AddAddressPage;