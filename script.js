/* eslint-disable no-alert */
/// //////////////////////////////////////////////
/// //////////////////////////////////////////////
// IOTA BANK APP

/// //////////////////////////////////////////////
// Data
const account1 = {
   owner: 'Ritik Sharma',
   movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
   interestRate: 1.2, // %
   pin: 1111,
   movementsDates: [
      '2019-01-27T09:15:04.904Z',
      '2019-04-01T10:17:24.185Z',
      '2019-05-27T17:01:17.194Z',
      '2019-07-11T23:36:17.929Z',
      '2019-11-18T21:31:17.178Z',
      '2019-12-23T07:42:02.383Z',
      '2023-01-24T14:11:59.604Z',
      '2023-01-26T10:51:36.790Z',
   ],
   currency: 'EUR',
   locale: 'pt-PT', // de-DE
};

const account2 = {
   owner: 'Yogesh Kumawat',
   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
   interestRate: 1.5,
   pin: 2222,
   movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2020-06-25T18:49:59.371Z',
      '2020-07-26T12:01:20.894Z',
   ],
   currency: 'USD',
   locale: 'en-US',
};

const account3 = {
   owner: 'Simar Saini',
   movements: [200, -200, 340, -300, -20, 50, 400, -460],
   interestRate: 0.7,
   pin: 3333,
   movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2020-06-25T18:49:59.371Z',
      '2020-07-26T12:01:20.894Z',
   ],
   currency: 'USD',
   locale: 'en-US',
};

const account4 = {
   owner: 'Jatin Sharma',
   movements: [430, 1000, 700, 50, 90],
   interestRate: 1,
   pin: 4444,
   movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
   ],
   currency: 'USD',
   locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

/// //////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
// const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/// //////////////////////////////////////////////
// Global Variables
let currentAccount;
let sorted = false;

/**
 * @function formatMovementDate to format movement date
 * @function calcDaysPassed to calculate the date difference
 */
const formatMovementDate = (movementDate) => {
   const calcDaysPassed = (date1, date2) =>
      Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

   const daysPassed = calcDaysPassed(new Date(), movementDate);

   if (daysPassed === 0) return 'Today';
   if (daysPassed === 1) return 'Yesterday';
   if (daysPassed <= 7) return `${daysPassed} days ago`;

   const day = `${movementDate.getDate()}`.padStart(2, 0);
   const month = `${movementDate.getMonth() + 1}`.padStart(2, 0);
   const year = movementDate.getFullYear();
   return `${day}/${month}/${year}`;
};

/**
 * Display deposit and withdrawal amount to the dashboard.
 * Display movements date.
 */
const displayMovements = (acc, sort = false) => {
   // "innerHTML" property replace HTML code with the new one.
   containerMovements.innerHTML = '';

   // FIXME : sort not working
   // Movements sorting conditions
   const sortMovements = sort
      ? acc.movements.slice().sort((a, b) => a - b)
      : acc.movements;

   // Display movements and movements date
   sortMovements.forEach((movement, i) => {
      const type = movement > 0 ? 'deposit' : 'withdrawal';

      const movementDate = new Date(acc.movementsDates[i]);
      const displayMovementDate = formatMovementDate(movementDate);

      const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
         i + 1
      } ${type}</div>
            <div class="movements__date">${displayMovementDate}</div>
            <div class="movements__value">${movement.toFixed(2)}€</div>
        </div>
      `;

      // "insertAdjacentHTML()" method insert/add HTML or XML code to a specified position.
      containerMovements.insertAdjacentHTML('afterbegin', html);
   });
};

/**
 * Display current balance to the dashboard.
 */
const calcDisplayBalance = (acc) => {
   acc.balance = acc.movements.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
   );

   labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

/**
 * Display total deposits, withdrawals and interest amount summary
 */
const calcDisplaySummary = (acc) => {
   // Display deposits summary
   const totaldepositAmount = acc.movements
      .filter((mov) => mov > 0)
      .reduce((accumulator, mov) => accumulator + mov, 0);
   labelSumIn.textContent = `${totaldepositAmount.toFixed(2)}€`;

   // Display withdrawals summary
   const totalWithdrawalAmount = acc.movements
      .filter((mov) => mov < 0)
      .reduce((accumulator, mov) => accumulator + mov, 0);
   labelSumOut.textContent = `${Math.abs(totalWithdrawalAmount).toFixed(2)}€`;

   // Display total interest amount
   const interest = acc.movements
      // filter out only deposit amount
      .filter((mov) => mov > 0)
      // calculate the interest for each deposit amount
      .map((deposit) => (deposit * acc.interestRate) / 100)
      // bank's rule: interest amount should be greater than one to calculate in the total interest amount
      .filter((interestAmount) => interestAmount >= 1)
      // calc total interest amount
      .reduce((accumulator, interestAmount) => accumulator + interestAmount, 0);
   labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

/**
 * Create username using account's owner's name
 * if name "Steven Thomas Williams" then username "stw"
 */
const createUserNames = (accs) => {
   accs.forEach((acc) => {
      acc.username = acc.owner
         .toLowerCase()
         .split(' ')
         .map((name) => name[0])
         .join('');
   });
};
createUserNames(accounts);

/**
 * Update UI
 */
const updateUI = (curAcc) => {
   // Display movements
   displayMovements(curAcc);

   // Display balance
   calcDisplayBalance(curAcc);

   // Display summary
   calcDisplaySummary(curAcc);
};

/**
 * Implementing Login
 */

// FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 1;

btnLogin.addEventListener('click', (e) => {
   // Prevent login form from submitting
   e.preventDefault();

   currentAccount = accounts.find(
      (acc) => acc.username === inputLoginUsername.value
   );

   if (currentAccount?.pin === Number(inputLoginPin.value)) {
      // Display UI and welcome message
      labelWelcome.textContent = `Welcome back, ${
         currentAccount.owner.split(' ')[0]
      }`;
      containerApp.style.opacity = 1;

      // Clear input fields
      inputLoginUsername.value = '';
      inputLoginPin.value = '';
      inputLoginPin.blur(); // "blur" method removes focus from an element.
      inputLoginUsername.blur();

      // Create current date and time
      const currentDate = new Date();
      const day = `${currentDate.getDate()}`.padStart(2, 0);
      const month = `${currentDate.getMonth() + 1}`.padStart(2, 0);
      const year = currentDate.getFullYear();
      const hour = `${currentDate.getHours()}`.padStart(2, 0);
      const mins = `${currentDate.getMinutes()}`.padStart(2, 0);
      labelDate.textContent = `${day}/${month}/${year}, ${hour}:${mins}`;

      // Update UI
      updateUI(currentAccount);
   } else {
      alert('Wrong username and password entered. Please check again!');
   }
});

/**
 * User Transfer Money
 */
btnTransfer.addEventListener('click', (e) => {
   e.preventDefault();

   const amount = Number(inputTransferAmount.value);
   const receiverAccount = accounts.find(
      (acc) => acc.username === inputTransferTo.value
   );

   if (
      amount > 0 &&
      receiverAccount &&
      currentAccount.balance >= amount &&
      receiverAccount?.username !== currentAccount.username
   ) {
      // Doing the transfer
      currentAccount.movements.push(-amount);
      receiverAccount.movements.push(amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Clear input fields
      inputTransferAmount.value = '';
      inputTransferTo.value = '';
      inputTransferAmount.blur(); // "blur" method removes focus from an element.
      inputTransferTo.blur();
   } else {
      alert('Incorrect! Please check entered detaild again.');
   }
});

/**
 * User Requests Loan
 */
btnLoan.addEventListener('click', (e) => {
   e.preventDefault();

   const amount = Math.floor(inputLoanAmount.value);

   // Any deposit > 10% of requested amount
   if (
      amount > 0 &&
      currentAccount.movements.some((mov) => mov >= amount * 0.1)
   ) {
      // Add positive movement to current user
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Clear input fields
      inputLoanAmount.value = '';
      inputLoanAmount.blur(); // "blur" method removes focus from an element.
   } else {
      alert(
         `Hey ${
            currentAccount.owner.split(' ')[0]
         }, requested amount is out of range. Please check!`
      );
   }
});

/**
 * Close Account
 */
btnClose.addEventListener('click', (e) => {
   e.preventDefault();

   // Check correct credentials
   if (
      inputCloseUsername.value === currentAccount.username &&
      Number(inputClosePin.value) === currentAccount.pin
   ) {
      // Find index of the current account
      const index = accounts.findIndex(
         (acc) => acc.username === currentAccount.username
      );

      // Delete account
      console.log(accounts.splice(index, 1));

      // Log out user (Hide UI)
      containerApp.style.opacity = 0;

      // Update welcome message
      labelWelcome.textContent = 'Log in to get started';
   }
});

/**
 * User Sorts Movements
 */
btnSort.addEventListener('click', (e) => {
   e.preventDefault();

   displayMovements(currentAccount.movements, !sorted);
   sorted = !sorted;

   // "blur" method removes focus from an element.
   btnSort.blur();
});

/// //////////////////////////////////////////////
/// //////////////////////////////////////////////
// LECTURES
