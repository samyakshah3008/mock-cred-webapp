"use client";

const StackedCard = ({ children, selectedIndex }: any) => {
  return children.map((stepComponent: any, i: any) => {
    let currStyles = {};
    if (i < selectedIndex) {
      currStyles = {
        top: "50%",
        transform: "translate(-50%, 100%) scale(0.8)",
        opacity: 0,
      };
    } else {
      currStyles = {
        top: 50 - 3.5 * (i - selectedIndex) + "%",
        pointerEvents: i - selectedIndex > 0 ? "none" : "auto",
        transform: `translate(-50%, -50%) scale(${
          1 - 0.05 * (i - selectedIndex)
        })`,
      };
    }

    return (
      <div
        style={{
          position: "absolute",
          left: "50%",
          transition: "all 0.5s",
          zIndex: children.length - i,
          ...currStyles,
        }}
        key={i}
      >
        {stepComponent}
      </div>
    );
  });
};

export default StackedCard;
