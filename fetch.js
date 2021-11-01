const { gql, GraphQLClient } = require('graphql-request');
const fs = require('fs-extra');
const path = require('path');

const LIMIT = 100;

const fetch = async ({
	repoName,
	repoOwner,
	repoBranch,
	apiUrl,
	token
}) => {
	const client = new GraphQLClient(apiUrl, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	let PRs = [];

	const query = gql`
		query { 
			repository(
				name: ${JSON.stringify(repoName)}
				owner: ${JSON.stringify(repoOwner)}
			) {
				pullRequests(
					baseRefName: ${JSON.stringify(repoBranch)}
					states: MERGED
					first: ${LIMIT}
					orderBy: {
						field: UPDATED_AT
						direction: DESC
					}
				) {
					nodes {
						author {
							login
						}
						title
						closedAt
					}
					pageInfo {
						endCursor
					}
				}
			}
		}
	`;

	const data = await client.request(query);

	let {
		repository: {
			pullRequests: {
				nodes: fetchedData,
				pageInfo: {
					endCursor
				}
			}
		}
	} = data;

	PRs = [...PRs, ...fetchedData];

	while (fetchedData.length > 0 && endCursor != null) {
		const query = gql`
			query { 
				repository(
					name: ${JSON.stringify(repoName)}
					owner: ${JSON.stringify(repoOwner)}
				) {
					pullRequests(
						baseRefName: ${JSON.stringify(repoBranch)}
						states: MERGED
						first: ${LIMIT}
						after: ${JSON.stringify(endCursor)}
						orderBy: {
							field: UPDATED_AT
							direction: DESC
						}
					) {
						nodes {
							author {
								login
							}
							title
							closedAt
						}
						pageInfo {
							endCursor
						}
					}
				}
			}
		`;

		const data = await client.request(query);

		({
			repository: {
				pullRequests: {
					nodes: fetchedData,
					pageInfo: {
						endCursor
					}
				}
			}
		} = data);

		PRs = [...PRs, ...fetchedData];
		fs.ensureDirSync(path.join(__dirname, 'cache'));
		await fs.writeFile(path.join(__dirname, 'cache', 'fetch-cache.json'), JSON.stringify(PRs, null, '\t'));
	}

	return PRs;
};

module.exports = fetch;