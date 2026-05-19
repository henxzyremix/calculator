document.addEventListener("DOMContentLoaded", () => {
    const expressionDisplay = document.querySelector(
        ".text-history-item"
    );

    const resultDisplay = document.querySelector(
        ".text-display-lg-mobile"
    );

    const buttons = document.querySelectorAll("button");

    let expression = "";

    // =========================
    // Button Events
    // =========================
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            let value = button.innerText.trim();

            // Handle material icon buttons
            const icon = button.querySelector(".material-symbols-outlined");
            if (icon) {
                value = icon.innerText.trim();
            }

            handleInput(value);
        });
    });

    // =========================
    // Input Handler
    // =========================
    function handleInput(value) {

        switch (value) {

            case "C":
                clearAll();
                break;

            case "backspace":
                backspace();
                break;

            case "=":
                calculate();
                break;

            case "÷":
                appendOperator("/");
                break;

            case "×":
                appendOperator("*");
                break;

            case "−":
                appendOperator("-");
                break;

            case "+":
                appendOperator("+");
                break;

            case "%":
                appendOperator("%");
                break;

            case "^":
                appendOperator("**");
                break;

            case "π":
                appendValue("Math.PI");
                break;

            case "e":
                appendValue("Math.E");
                break;

            case "sin":
                appendFunction("Math.sin(");
                break;

            case "cos":
                appendFunction("Math.cos(");
                break;

            case "tan":
                appendFunction("Math.tan(");
                break;

            case "log":
                appendFunction("Math.log10(");
                break;

            case "ln":
                appendFunction("Math.log(");
                break;

            case "√":
                appendFunction("Math.sqrt(");
                break;

            case "!":
                factorial();
                break;

            case "( )":
                addBrackets();
                break;

            default:
                appendValue(value);
        }
    }

    // =========================
    // Append Number / Text
    // =========================
    function appendValue(value) {
        expression += value;
        updateDisplay();
    }

    // =========================
    // Append Operators
    // =========================
    function appendOperator(operator) {

        if (expression === "") return;

        const lastChar = expression.slice(-1);

        if (["+", "-", "*", "/", "%"].includes(lastChar)) {
            expression = expression.slice(0, -1);
        }

        expression += operator;

        updateDisplay();
    }

    // =========================
    // Scientific Functions
    // =========================
    function appendFunction(func) {
        expression += func;
        updateDisplay();
    }

    // =========================
    // Brackets Toggle
    // =========================
    function addBrackets() {

        const openBrackets =
            (expression.match(/\(/g) || []).length;

        const closeBrackets =
            (expression.match(/\)/g) || []).length;

        if (openBrackets > closeBrackets) {
            expression += ")";
        } else {
            expression += "(";
        }

        updateDisplay();
    }

    // =========================
    // Factorial
    // =========================
    function factorial() {

        try {

            const value = eval(expression);

            if (value < 0) {
                resultDisplay.textContent = "Error";
                return;
            }

            let result = 1;

            for (let i = 2; i <= value; i++) {
                result *= i;
            }

            expression = result.toString();

            updateDisplay();

        } catch {
            resultDisplay.textContent = "Error";
        }
    }

    // =========================
    // Calculate Result
    // =========================
    function calculate() {

        try {

            let formattedExpression = expression
                .replace(/%/g, "/100");

            const result = eval(formattedExpression);

            resultDisplay.textContent =
                formatNumber(result);

            expressionDisplay.textContent =
                cleanExpression(expression);

            saveToHistory(cleanExpression(expression), formatNumber(result));

            expression = result.toString();

        } catch {

            resultDisplay.textContent = "Error";
        }
    }

    // =========================
    // Clear All
    // =========================
    function clearAll() {
        expression = "";

        expressionDisplay.textContent = "0";
        resultDisplay.textContent = "0";
    }

    // =========================
    // Backspace
    // =========================
    function backspace() {

        expression = expression.slice(0, -1);

        updateDisplay();
    }

    // =========================
    // Live Display Update
    // =========================
    function updateDisplay() {

        expressionDisplay.textContent =
            cleanExpression(expression) || "0";

        try {

            let formattedExpression = expression
                .replace(/%/g, "/100");

            const preview =
                eval(formattedExpression);

            if (expression !== "") {
                resultDisplay.textContent =
                    formatNumber(preview);
            }

        } catch {
            // Ignore invalid typing state
        }
    }

    // =========================
    // Format Numbers
    // =========================
    function formatNumber(num) {

        return Number(num).toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 10
            }
        );
    }

    // =========================
    // Clean Expression Display
    // =========================
    function cleanExpression(exp) {

        return exp
            .replace(/Math\.PI/g, "π")
            .replace(/Math\.E/g, "e")
            .replace(/Math\.sin\(/g, "sin(")
            .replace(/Math\.cos\(/g, "cos(")
            .replace(/Math\.tan\(/g, "tan(")
            .replace(/Math\.log10\(/g, "log(")
            .replace(/Math\.log\(/g, "ln(")
            .replace(/Math\.sqrt\(/g, "√(")
            .replace(/\*\*/g, "^");
    }

    // =========================
    // Initialize
    // =========================
    clearAll();

});
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