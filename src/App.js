import { useState } from "react";
import Button from "./components/Button";
import ButtonBox from "./components/ButtonBox";
import Screen from "./components/Screen";
import Wrapper from "./components/Wrapper";

function App() {
  const [calc, setcalc] = useState({
    sign: "",
    num: 0,
    res: 0,
  });
  const btnValues = [
    ["C", "+-", "%", "/"],
    [7, 8, 9, "X"],
    [4, 5, 6, "-"],
    [1, 2, 3, "+"],
    [0, ".", "="],
  ];

  const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    if (removeSpaces(calc.num).length < 16) {
      setcalc({
        ...calc,
        num:
          calc.num === 0 && value === "0"
            ? "0"
            : removeSpaces(calc.num) % 1 === 0
            ? toLocalString(Number(removeSpaces(calc.num + value)))
            : toLocalString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
      });
    }
  };

  const commaClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setcalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  };

  const signClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    console.log(value,calc)
    setcalc({
      ...calc,
      sign: value,
      res: !calc.res && calc.num ? calc.num : calc.res ,
      num: 0,
    });
  };

  const equalsClickHandler = () => {
    if (calc.num && calc.sign) {
      const math = (a, b, sign) => {
        return sign === "+"
          ? a + b
          : sign === "-"
          ? a - b
          : sign === "X"
          ? a * b
          : a / b;
      };
      setcalc({
        ...calc,
        res:calc.num === "0" && calc.sign === "/"
            ? "Can't divide with 0"
            : toLocalString(math(Number(removeSpaces(calc.res)), Number(removeSpaces(calc.num)), calc.sign)),
        sign: "",
        num: 0,
      });
    }
  };

  const invertClickHandler = () => {
    setcalc({
      ...calc,
      num: calc.num ? toLocalString(removeSpaces(calc.num)) * -1  : 0,
      res: calc.res ? toLocalString(removeSpaces(calc.res)) * -1 : 0,
      sign: "",
    });
  };

  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

    setcalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: "",
    });
  };

  const resetClickHandler = () => {
    setcalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
    });
  };

  const toLocalString = (num) => {
    return String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");
  };

  const removeSpaces = (num) => num.toString().replace(/\s/g, "");

  function calculation(e,key) {
    switch (key) {
      case "C":
        return resetClickHandler(e);
      case "+-":
        return invertClickHandler(e);
      case "%":
        return percentClickHandler(e);
      case "=":
        return equalsClickHandler();
      case "/":
      case "+":
      case "-":
      case "X":   
        return signClickHandler(e);
      case ".":
        return commaClickHandler(e);
      default:
        return numClickHandler(e);
    }
  }

  return (
    <Wrapper>
      <Screen value={calc.num ? calc.num : calc.res} />
      <ButtonBox>
        {btnValues.flat().map((btn, i) => {
          return (
            <Button
              key={i}
              className={btn == "=" ? "equals" : ""}
              value={btn}
              onClick={(e)=>calculation(e,btn)}
            ></Button>
          );
        })}
      </ButtonBox>
    </Wrapper>
  );
}

export default App;
