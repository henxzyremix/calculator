// Calculator State
  const expressionDisplay = document.querySelector(
    ".text-on-surface-variant.font-history-item"
  );
  const resultDisplay = document.querySelector(
    ".text-on-surface.font-display-lg-mobile"
  );

  let expression = "";

  // Button Mapping
  const buttons = document.querySelectorAll("button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value =
        button.innerText.trim() ||
        button.querySelector(".material-symbols-outlined")?.innerText.trim();

      handleInput(value);
    });
  });

  function handleInput(value) {
    switch (value) {
      case "C":
        clearAll();
        break;

      case "backspace":
        backspace();
        break;

      case "add":
        appendOperator("+");
        break;

      case "remove":
        appendOperator("-");
        break;

      case "close":
        appendOperator("*");
        break;

      case "article":
        appendOperator("/");
        break;

      case "%":
        appendOperator("%");
        break;

      case "equal":
        calculate();
        break;

      default:
        appendValue(value);
    }
  }

  function appendValue(value) {
    expression += value;
    updateDisplay();
  }

  function appendOperator(operator) {
    if (expression === "") return;

    const lastChar = expression.slice(-1);

    // Prevent multiple operators
    if (["+", "-", "*", "/", "%"].includes(lastChar)) {
      expression = expression.slice(0, -1);
    }

    expression += operator;
    updateDisplay();
  }

  function clearAll() {
    expression = "";
    expressionDisplay.textContent = "0";
    resultDisplay.textContent = "0";
  }

  function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay();
  }

function calculate() {

  try {

    // Save original expression BEFORE overwrite
    const originalExpression = expression;

    // Format percentage
    let formattedExpression =
      expression.replace(/%/g, "/");

    // Calculate result
    const result =
      eval(formattedExpression);

    // Update UI
    resultDisplay.textContent =
      formatNumber(result);

    expressionDisplay.textContent =
      originalExpression;

    // SAVE TO HISTORY
    saveToHistory(
      originalExpression,
      formatNumber(result)
    );

    // Continue calculation
    expression = result.toString();

  } catch (error) {

    resultDisplay.textContent = "Error";
  }
}
  function updateDisplay() {
    expressionDisplay.textContent = expression || "0";

    try {
      let formattedExpression = expression.replace(/%/g, "/");

      const preview = eval(formattedExpression);

      if (expression !== "") {
        resultDisplay.textContent = formatNumber(preview);
      }
    } catch {
      // Ignore invalid temporary expressions
    }
  }

  function formatNumber(num) {
    return Number(num).toLocaleString("en-US", {
      maximumFractionDigits: 10,
    });
  }

  // Initialize
  clearAll();
  function saveToHistory(expression, result) {

    const history =
        JSON.parse(
            localStorage.getItem("calculatorHistory")
        ) || [];

    history.push({
        expression: expression,
        result: result,
        date: new Date().toISOString()
    });

    // Keep only latest 50
    if (history.length > 50) {
        history.shift();
    }

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );
}
