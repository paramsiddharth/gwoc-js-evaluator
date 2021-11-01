require('dotenv').config();

const {
	TOKEN,
	API_URL,
	REPO_OWNER,
	REPO_NAME,
	REPO_BRANCH
} = process.env;

const fs = require('fs-extra');
const path = require('path');
const csv = require('csv');
const { Readable, Duplex } = require('stream');

const fetch = require('./fetch');
const evaluate = require('./evaluate');

const main = async () => {
	try {
		const PRs = await fetch({
			apiUrl: API_URL,
			token: TOKEN,
			repoBranch: REPO_BRANCH,
			repoName: REPO_NAME,
			repoOwner: REPO_OWNER
		});

		console.log(`%o records found.`, PRs.length);

		const evaluation = await evaluate(PRs);

		fs.ensureDirSync(path.join(__dirname, 'out'));
		fs.writeFileSync(path.join(__dirname, 'out', 'evaluation.json'), JSON.stringify(evaluation, null, '\t'));

		const arrayOfUsers = Object.keys(evaluation).map(username => ({ username, ...evaluation[username] }));
		const arrayOfPRs = [];
		
		await Promise.all(
			arrayOfUsers.map(
				async user => await Promise.all(
					user.contributions.map(
						async contrib => arrayOfPRs.push({ Contributor: user.username, Contribution: contrib.title, Date: contrib.date })
					)
				)
			)
		);

		arrayOfUsers.sort((a, b) => b.count - a.count);
		arrayOfPRs.sort((a, b) => Date.parse(b.Date) - Date.parse(a.Date));

		for (const user of arrayOfUsers) {
			console.log(`${user.username}: %o`, user.count);
		}

		const evaluationWriteStream = fs.createWriteStream(path.join(__dirname, 'out', 'evaluation.csv'));
		const contributionsWriteStream = fs.createWriteStream(path.join(__dirname, 'out', 'contributions.csv'));

		const evaluationReadStream = Readable.from(arrayOfUsers);
		const contributionsReadStream = Readable.from(arrayOfPRs);

		evaluationReadStream
			.pipe(csv.transform(o => ({ Contributor: o.username, Score: o.count })))
			.pipe(csv.stringify({ header: true }))
			.pipe(evaluationWriteStream);

		contributionsReadStream
			.pipe(csv.stringify({ header: true }))
			.pipe(contributionsWriteStream);
	} catch (e) {
		console.error(e);
	}
};

if (require.main === module)
	main();