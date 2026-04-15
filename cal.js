class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
        this.setupKeyboard();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.shouldResetScreen) return;
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.showError();
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        // Handle floating point precision
        computation = Math.round(computation * 100000000) / 100000000;
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
    }

    showError() {
        this.currentOperandElement.parentElement.classList.add('error');
        this.currentOperand = 'Error';
        setTimeout(() => {
            this.currentOperandElement.parentElement.classList.remove('error');
            this.clear();
            this.updateDisplay();
        }, 1000);
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            const opSymbol = this.operation === '*' ? '×' : 
                           this.operation === '/' ? '÷' : 
                           this.operation === '-' ? '−' : this.operation;
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${opSymbol}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') this.appendNumber(e.key);
            if (e.key === '.') this.appendNumber('.');
            if (e.key === '=' || e.key === 'Enter') {
                e.preventDefault();
                this.compute();
            }
            if (e.key === 'Backspace') this.delete();
            if (e.key === 'Escape') this.clear();
            if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                this.chooseOperation(e.key);
            }
            if (e.key === '%') this.percentage();
            
            this.updateDisplay();
            
            // Visual feedback for keyboard
            const keyMap = {
                'Enter': '[data-action="calculate"]',
                'Escape': '[data-action="clear"]',
                'Backspace': '[data-action="delete"]',
                '%': '[data-action="percent"]'
            };
            
            let selector = keyMap[e.key];
            if (!selector && '/*-+'.includes(e.key)) {
                selector = `[data-value="${e.key}"]`;
            } else if (!selector && /[0-9.]/.test(e.key)) {
                selector = `[data-value="${e.key}"]`;
            }
            
            if (selector) {
                const btn = document.querySelector(selector);
                if (btn) {
                    btn.classList.add('active');
                    setTimeout(() => btn.classList.remove('active'), 100);
                }
            }
        });
    }
}

// Initialize calculator
const previousOperandElement = document.getElementById('previous');
const currentOperandElement = document.getElementById('current');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Button click handlers
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        const value = button.dataset.value;
        
        if (action === 'clear') {
            calculator.clear();
        } else if (action === 'delete') {
            calculator.delete();
        } else if (action === 'percent') {
            calculator.percentage();
        } else if (action === 'operator') {
            calculator.chooseOperation(value);
        } else if (action === 'calculate') {
            calculator.compute();
        } else {
            calculator.appendNumber(value);
        }
        
        calculator.updateDisplay();
    });
});

// Add active state styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn.active {
        transform: scale(0.95);
        background: var(--btn-active);
    }
`;
document.head.appendChild(style);