let screen = document.querySelector(".screen");
let btns = document.querySelectorAll(".btn");

for (let btn of btns) {
  btn.addEventListener("click", () => {
    adder(btn);
  });
}

function adder(btn) {
  if (btn.id === "ac") {
    clearScreen();
  } else if (btn.id === "delete") {
    deleteLast();
  } else if (btn.classList.contains("operator")) {
    addOperator(btn);
  } else if (btn.id === "equal") {
    calculate();
  } else {
    screen.innerText += btn.innerText;
  }
}
function clearScreen() {
  screen.innerText = "";
}

function deleteLast() {
  screen.innerText = screen.innerText.slice(0, length - 1);
}
function addOperator(btn) {
  if (screen.innerText === "") {
    return;
  } else if (screen.innerText.includes(".")) {
    screen.innerText += btn.innerText;
  } else {
    screen.innerText += btn.innerText;
  }
}

function calculate(){
  let value=screen.innerText;
  try{
    let result= eval(value);
    return screen.innerText=result;
  }
  catch{
    return screen.innerText="Error";
  }
}


