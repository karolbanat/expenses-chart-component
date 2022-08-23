const FULL_DAY_NAMES = {
	mon: 'Monday',
	tue: 'Tuesday',
	wed: 'Wednesday',
	thu: 'Thursday',
	fri: 'Friday',
	sat: 'Saturday',
	sun: 'Sunday',
};
/* Week days abbreviations for getting the current day and setting current bar */
const WEEK_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
/* Bar height controls */
const MAX_BAR_HEIGHT = 15;
const BAR_HEIGHT_UNIT = 'rem';

let expenseChart;

const main = () => {
	prepareDOMElements();
	loadData();
};

const prepareDOMElements = () => {
	expenseChart = document.querySelector('.expenses-chart');
};

const loadData = () => {
	fetch('./data.json')
		.then((data) => data.json())
		.then((data) => {
			return processData(data);
		})
		.then((data) => {
			insertData(data);
		});
};

/* Processes data to get values needed for insertion.  */
const processData = (data) => {
	const maxAmount = getMaxAmount(data);
	return data.map((expense) => {
		/* calculates height based on maxed amount and current processed expense amount */
		const height = ((expense.amount / maxAmount) * MAX_BAR_HEIGHT).toFixed(2);
		return {
			...expense,
			fullDay: FULL_DAY_NAMES[expense.day],
			height,
		};
	});
};

/* Gets the highest amount in the expenses array. Based on this value the height of the bar is calculated. */
const getMaxAmount = (data) => {
	return Math.max(...data.map((expense) => expense.amount));
};

/* Data insertion */
const insertData = (data) => {
	data.forEach((expense) => {
		/* gets the column based on the expense day... */
		const chartColumn = expenseChart.querySelector(`[data-day=${expense.day}]`);
		/* ... and needed elements within it */
		const dayLabel = chartColumn.querySelector('[data-day-label]');
		const chartBar = chartColumn.querySelector('[data-bar]');
		const amountLabel = chartColumn.querySelector('[data-amount]');

		/* set current day bar */
		if (expense.day === getCurrentDay()) chartColumn.setAttribute('data-current', true);

		/* load day label data */
		dayLabel.innerText = expense.day;
		dayLabel.title = expense.fullDay;
		dayLabel.dataset.dayLabel = expense.day;
		/* set bars height and data */
		chartBar.dataset.bar = expense.height;
		chartBar.style.height = `${expense.height}${BAR_HEIGHT_UNIT}`;
		/* set amount label */
		amountLabel.innerText = `$${expense.amount}`;
		amountLabel.dataset.amount = expense.amount;
	});
};

const getCurrentDay = () => {
	const today = new Date().getDay();
	return WEEK_DAYS[today];
};

document.addEventListener('DOMContentLoaded', main);
