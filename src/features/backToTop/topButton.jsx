import * as React from "react";
import { TbArrowBarToUp } from "react-icons/tb";

import "./topButton.css";

const TopButton = () => {
  const [showButton, setShowButton] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 20) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="top-container">
      <button className="top-button" onClick={backToTop} style={{ display: showButton ? "block" : "none" }}>
        <TbArrowBarToUp size={28}/>
      </button>
    </div>
  );
};

export default TopButton;
