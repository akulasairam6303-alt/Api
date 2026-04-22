const DEMO_MODE = false;

export const getDeliveryMessage = (stage, deliveryDate) => {
  const now = new Date();
  const diffTime = deliveryDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (stage === 4) return "Arrived";
  if (diffDays <= 0) return "Arriving Today";
  if (diffDays === 1) return "Arriving Tomorrow";
  if (diffDays <= 5) return `Arriving in ${diffDays} days`;

  return `Expected by ${deliveryDate.toDateString()}`;
};

export const getDeliveryDate = (date, deliveredAt) => {
  const base = deliveredAt
    ? new Date(deliveredAt)
    : new Date(date || Date.now());

  if (!deliveredAt) {
    base.setDate(base.getDate() + 3);
  }

  return base;
};

export const getStage = (date) => {
  const diff = Date.now() - new Date(date).getTime();

  if (DEMO_MODE) {
    if (diff < 3000) return 1;
    if (diff < 6000) return 2;
    if (diff < 9000) return 3;
    return 4;
  }

  if (diff < 10000) return 1;
  if (diff < 24 * 60 * 60 * 1000) return 2;
  if (diff < 4 * 24 * 60 * 60 * 1000) return 3;

  return 4;
};

export const getStatusText = (stage) => {
  if (stage === 1) return "Order Placed";
  if (stage === 2) return "Processing";
  if (stage === 3) return "Shipped";
  return "Delivered";
};

export const getStatusClass = (status) => {
  if (status === "Cancelled") return "status red";
  if (status === "Order Placed") return "status gray";
  if (status === "Processing") return "status orange";
  if (status === "Shipped") return "status blue";
  return "status green";
};

export const formatAddress = (addr) => {
  if (!addr) return "";

  const a = addr.address || addr;

  return [
    a.flat,
    a.area,
    a.city,
    a.district,
    a.state,
    a.pincode && `- ${a.pincode}`
  ]
    .filter(Boolean)
    .join(", ");
};

export const getCountdown = (date, stage) => {
  if (stage === 4) return "Delivered";

  const orderTime = new Date(date).getTime();
  const now = Date.now();

  let targetTime;

  if (DEMO_MODE) {
    if (stage === 1) targetTime = orderTime + 3000;
    else if (stage === 2) targetTime = orderTime + 6000;
    else if (stage === 3) targetTime = orderTime + 9000;
  } else {
    if (stage === 1) targetTime = orderTime + 10000;
    else if (stage === 2) targetTime = orderTime + 24 * 60 * 60 * 1000;
    else if (stage === 3) targetTime = orderTime + 4 * 24 * 60 * 60 * 1000;
  }

  const remaining = targetTime - now;

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
};

export const canCancel = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  return DEMO_MODE ? diff < 5000 : diff <= 2 * 60 * 60 * 1000;
};

export const getCancelRemaining = (date) => {
  const diff = Date.now() - new Date(date).getTime();

  let remaining = DEMO_MODE
    ? 5000 - diff
    : 2 * 60 * 60 * 1000 - diff;

  if (remaining <= 0) return "Cancellation window closed";

  const minutes = Math.floor(remaining / (1000 * 60));
  const seconds = Math.floor((remaining / 1000) % 60);

  return DEMO_MODE
    ? `Cancel in ${seconds}s`
    : `Cancellation available upto ${minutes}m ${seconds}s`;
};