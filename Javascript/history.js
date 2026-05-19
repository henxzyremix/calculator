document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // Elements
    // =========================
    const historyContainer = document.querySelector("main");
    const clearButton = document.querySelector("button");

    // =========================
    // Load History
    // =========================
    loadHistory();

    // =========================
    // Clear History Button
    // =========================
    const clearHistoryBtn = document.querySelectorAll("button");

    clearHistoryBtn.forEach((btn) => {
        if (btn.innerText.includes("Clear History")) {
            btn.addEventListener("click", clearHistory);
        }
    });

    // =========================
    // Load History Function
    // =========================
    function loadHistory() {

        const savedHistory =
            JSON.parse(localStorage.getItem("calculatorHistory")) || [];

        // Remove existing generated items
        const sections = document.querySelectorAll(".dynamic-history");

        sections.forEach(section => section.remove());

        // Empty State
        if (savedHistory.length === 0) {

            createEmptyState();

            return;
        }

        // Group by Date
        const grouped = groupByDate(savedHistory);

        Object.keys(grouped).forEach((dateKey) => {

            const section = document.createElement("section");

            section.className = "mb-10 dynamic-history";

            section.innerHTML = `
                <h3 class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest mb-4 border-b border-outline-variant pb-2">
                    ${dateKey}
                </h3>

                <div class="space-y-6">
                    ${grouped[dateKey]
                        .map(item => `
                            <div class="group flex flex-col items-end gap-1 p-4 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer history-item">

                                <span class="font-history-item text-history-item text-on-surface-variant text-right">
                                    ${item.expression}
                                </span>

                                <span class="font-display-lg-mobile text-[32px] font-bold text-primary leading-tight">
                                    ${item.result}
                                </span>

                            </div>
                        `)
                        .join("")}
                </div>
            `;

            // Insert before empty state
            const emptyState = document.querySelector(".empty-state");

            if (emptyState) {
                historyContainer.insertBefore(section, emptyState);
            } else {
                historyContainer.appendChild(section);
            }
        });
    }

    // =========================
    // Group By Date
    // =========================
    function groupByDate(history) {

        const grouped = {};

        history.reverse().forEach((item) => {

            const itemDate = new Date(item.date);

            const today = new Date();

            const yesterday = new Date();

            yesterday.setDate(today.getDate() - 1);

            let label = itemDate.toLocaleDateString();

            if (
                itemDate.toDateString() === today.toDateString()
            ) {
                label = "Today";
            }

            else if (
                itemDate.toDateString() === yesterday.toDateString()
            ) {
                label = "Yesterday";
            }

            if (!grouped[label]) {
                grouped[label] = [];
            }

            grouped[label].push(item);
        });

        return grouped;
    }

    // =========================
    // Clear History
    // =========================
    function clearHistory() {

        localStorage.removeItem("calculatorHistory");

        loadHistory();
    }

    // =========================
    // Empty State
    // =========================
    function createEmptyState() {

        let empty = document.querySelector(".empty-state");

        if (empty) return;

        empty = document.createElement("div");

        empty.className =
            "empty-state mt-12 opacity-20 flex flex-col items-center justify-center text-center";

        empty.innerHTML = `
            <span class="material-symbols-outlined text-[64px] mb-4">
                history
            </span>

            <p class="text-label-sm font-label-sm">
                NO CALCULATION HISTORY
            </p>
        `;

        historyContainer.appendChild(empty);
    }

});
const history =
    JSON.parse(localStorage.getItem("calculatorHistory")) || [];

history.push({
    expression: expression,
    result: result,
    date: new Date().toISOString()
});

localStorage.setItem(
    "calculatorHistory",
    JSON.stringify(history)
);