function Popup({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          minWidth: "300px",
          textAlign: "center",
          borderLeft: `6px solid ${
          type === "success" ? "green" : "red"
          }`
        }}
      >
        <p style={{ marginBottom: "20px" }}>{message}</p>
        <button onClick={onClose}
        style={{ cursor: "pointer" }}
        >OK</button>
      </div>
    </div>
  );
}

export default Popup;