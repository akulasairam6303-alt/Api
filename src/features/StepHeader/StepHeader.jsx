import { useNavigate } from "react-router-dom";
import "../StepHeader/StepHeader.css";

function StepHeader({ currentStep }) {
  const navigate = useNavigate();

  const steps = [
    { label: "My Cart", path: "/cart" },
    { label: "Address", path: "/address" },
    { label: "Payment", path: "/payment" },
    { label: "Order Confirm", path: "/order-confirm" }
  ];

  return (
    <div className="step-header">

      {steps.map((step, index) => {
        const stepNumber = index + 1;

        let status = "";
        if (currentStep > stepNumber) status = "completed";
        else if (currentStep === stepNumber) status = "active";

        return (
          <div
            key={step.label}
            className={`step ${status}`}
            onClick={() => {
              if (stepNumber < currentStep) {
                navigate(step.path);   
              }
            }}
          >
            <div className="step-circle">
              {status === "completed" ? "✓" : stepNumber}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        );
      })}

    </div>
  );
}

export default StepHeader;