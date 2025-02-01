// DOM Elements
const incomeElement = document.getElementById("total-income");
const expenseElement = document.getElementById("total-expenses");
const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const expenseChartCtx = document.getElementById("expense-chart").getContext("2d");

// Data Arrays
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let expenseCategories = {};

// Initialize Chart
let expenseChart;

// Save Data to LocalStorage
function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize and Update Chart
function updateExpenseChart() {
    expenseCategories = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

    if (expenseChart) expenseChart.destroy();

    expenseChart = new Chart(expenseChartCtx, {
        type: "pie",
        data: {
            labels: Object.keys(expenseCategories),
            datasets: [
                {
                    label: "Expenses by Category",
                    data: Object.values(expenseCategories),
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                },
            ],
        },
    });
}

// Handle Transactions
transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("transaction-date").value;
    const category = document.getElementById("transaction-category").value;
    const amount = parseFloat(document.getElementById("transaction-amount").value);
    const type = document.getElementById("transaction-type").value;

    const transaction = { date, category, amount, type };
    transactions.push(transaction);
    saveData();
    updateTransactions();
    updateDashboard();
    updateExpenseChart();
    transactionForm.reset();
});

function updateTransactions() {
    transactionList.innerHTML = "";
    transactions.forEach((transaction) => {
        const li = document.createElement("li");
        const spanCategory = document.createElement("span");
        const spanAmount = document.createElement("span");
        const spanType = document.createElement("span");

        spanCategory.textContent = `${transaction.date} - ${transaction.category}`;
        spanAmount.textContent = `$${transaction.amount.toFixed(2)}`;
        spanType.textContent = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
        spanType.classList.add("transaction-type", transaction.type);

        li.appendChild(spanCategory);
        li.appendChild(spanAmount);
        li.appendChild(spanType);
        transactionList.appendChild(li);
    });
}

// Update Dashboard
function updateDashboard() {
    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    incomeElement.textContent = `$${totalIncome.toFixed(2)}`;
    expenseElement.textContent = `$${totalExpenses.toFixed(2)}`;
}

// Initialize App
function init() {
    updateTransactions();
    updateDashboard();
    updateExpenseChart();
}

init();
