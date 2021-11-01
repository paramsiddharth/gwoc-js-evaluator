const fs = require('fs-extra');
const path = require('path');

const evaluate = async arr => {
	const results = {};

	for (const pr of arr) {
		const {
			author: {
				login: username
			},
			title,
			closedAt: date
		} = pr;

		if (username in results) {
			const userResult = results[username];
			userResult.count++;
			userResult.contributions.push({ title, date });
		} else {
			const userResult = {
				count: 1,
				contributions: [{ title, date }]
			};
			results[username] = userResult;
		}
	}

	fs.ensureDirSync(path.join(__dirname, 'cache'));
	await fs.writeFile(path.join(__dirname, 'cache', 'evaluate-cache.json'), JSON.stringify(results, null, '\t'));
	return results;
};

module.exports = evaluate;