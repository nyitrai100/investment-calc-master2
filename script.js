const depositInput = document.querySelector("#deposit");
const durationInput = document.querySelector("#duration");
const principleBalance = document.querySelector("#principleBalance");
const percentage = 0.0593;
const rate = 0.1779;
const compoundPercentage = 1.0593;
const totalBalance = document.querySelector("#totalBalance");
const quarterly = 4;
let fee = 0;

function getTotalBalance() {
  const num = parseInt(depositInput.value) * parseInt(durationInput.value) * percentage + parseInt(depositInput.value);
  return num.toFixed(0);
}
function getTotalAfterFee() {
  let num = parseInt(getOverallProfit() + parseInt(depositInput.value));
  return num.toFixed(1);
}
function getQuartely() {
  if (durationInput.value == 12) return 4;
  if (durationInput.value == 36) return 12;
  if (durationInput.value == 60) return 20;
}
function getOverallProfit() {
  let calc = parseInt(depositInput.value) * rate * getChargePercentageOnDep() * getQuartely() + parseInt(depositInput.value);
  return calc.toFixed(0);
}
function getCompoundProfit() {
  const num = getTotalCompound() - parseInt(depositInput.value);
  return num.toFixed(1);
}
function getCompoundQuarelyProfit() {
  // let quarter1 = deposit * rate * fee30 + deposit;
  let calc;
  for (let i = 1; i < getQuartely(); i++) {
    if (i == 1) {
      calc = parseInt(depositInput.value) * rate * getChargePercentageOnDep() + parseInt(depositInput.value);
    }
    calc = calc * rate * getChargePercentageOnDep() + calc;
  }
  return calc.toFixed(0);
}

function getPrincipleAmount() {
  return depositInput.value;
}
function getPrincipleCompound() {
  const num = (parseInt(depositInput.value) / getCompoundQuarelyProfit()) * 100;
  return num.toFixed(1);
}
function getTotalCompound() {
  const num = Math.pow(compoundPercentage, durationInput.value);
  const value = parseInt(depositInput.value) * num;
  return value.toFixed(0);
}
function getPrinciplePercentage() {
  const num = (getPrincipleAmount() / getOverallProfit()) * 100;
  return num.toFixed(1);
}
function getPrincipleCompoundPercentage() {
  return (100 - getProfitCompoundPercentage()).toFixed(1);
}
function getProfitPercentage() {
  return (100 - getPrinciplePercentage()).toFixed(1);
}
function getProfitCompoundPercentage() {
  return (100 - getPrincipleCompound()).toFixed(1);
}
const isCompound = document.querySelector("#isCompound");
isCompound.addEventListener("change", () => {
  updateNumbers();
});
function updateNumbers() {
  console.log(getChargePercentageOnDep());
  if (isNaN(parseInt(depositInput.value))) {
    alert("Input may not include letters!");
  } else {
    if (depositInput.value >= 5000) {
      if (isCompound.checked == 1) {
        totalBalance.innerHTML = "£" + getCompoundQuarelyProfit();
        pieText.innerHTML = "£" + getCompoundQuarelyProfit();

        myChart.data.datasets[0].data[1] = getProfitCompoundPercentage();
        myChart.data.datasets[0].data[0] = getPrincipleCompoundPercentage();
        myChart.data.labels[1] = `${getProfitCompoundPercentage()}% Overall Profit`;
        myChart.data.labels[0] = `${getPrincipleCompoundPercentage()}% Principle Amount`;
      } else {
        totalBalance.innerHTML = "£" + getOverallProfit();
        pieText.innerHTML = "£" + getOverallProfit();
        myChart.data.datasets[0].data[1] = getProfitPercentage();
        myChart.data.datasets[0].data[0] = getPrinciplePercentage();
        myChart.data.labels[1] = `${getProfitPercentage()}% Overall Profit`;
        myChart.data.labels[0] = `${getPrinciplePercentage()}% Principle Amount`;
      }
      principleBalance.innerHTML = "£" + depositInput.value;
      myChart.update();
    } else {
      alert("Make sure the input is within range!");
    }
  }
}
function getChargePercentageOnDep() {
  if (depositInput.value < 500000) {
    if (durationInput.value == 12) {
      return 0.7;
    }
    if (durationInput.value == 36) {
      return 0.75;
    }
    if (durationInput.value == 60) {
      return 0.8;
    }
  }
  if (depositInput.value >= 500000 && depositInput.value <= 999999) {
    return 0.8;
  }
  if (depositInput.value >= 1000000) {
    return 0.85;
  }
}

depositInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    updateNumbers();
  }
});
durationInput.addEventListener("change", function () {
  updateNumbers();
});
const pieText = document.querySelector("#pieText");

pieText.innerHTML = "£" + getOverallProfit();

//CHART WORK
const ctx = document.getElementById("data-set");

const data = {
  labels: [`${getPrinciplePercentage()}% Principle Amount`, `${getProfitPercentage()}% Overall Profit`],
  datasets: [
    {
      data: [getPrinciplePercentage(), getProfitPercentage()],
      borderWidth: 1,
      backgroundColor: ["#D0CEDF", "#283C53"],
    },
  ],
};

addEventListener("resize", (event) => {
  if (window.innerWidth <= 420) {
    myChart.config.options.radius = 120;
    Chart.defaults.font.size = 8;
    myChart.update();
  } else {
    myChart.config.options.radius = 150;
    Chart.defaults.font.size = 12;
    myChart.update();
  }
});
Chart.defaults.font.size = 12;
const config = {
  type: "doughnut",
  options: {
    cutout: 200,
    radius: 150,
    plugins: {
      legend: {
        position: "bottom",
        font: {
          size: 16,
        },
      },
    },
    events: [],
  },
  data,
};

const myChart = new Chart(document.getElementById("data-set"), config);