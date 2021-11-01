# Evaluator for JavaScript - GWoC
The evaluation script for JavaScript in GWoC 2021.

## Instructions
The following environment variables should be made available:
```bash
# A personal access token of yours on GitHub
export TOKEN=ghp_----------------------------

# The GitHub GraphQL API URL
export API_URL=https://api.github.com/graphql

# The repository owner organization/user identifier
export REPO_OWNER=girlscript

# The repository name/identifier
export REPO_NAME=winter-of-contributing

# The contribution branch
export REPO_BRANCH=Javascript
```

Install the dependencies and run the script.
```bash
npm ci
npm start
```

Retrieve the results from the following files in the `out` directory:
- `evaluation.json`
  
  Format:
  ```js
  {
    username_xyz: {
      count: 000, // The number of PRs merged
      contributions: [ // A list of merged contributions
        {
          title: "------", // The PR title
          date: "XX-XX-XX" // The merge date as an ISO string
        },
        ...
      ]
    }
  }
  ```
- `evaluation.csv`
  
  Format:

  | Contributor | Score |
  | ---         | --:   |
  | username_xyz | 13 |
  | username_abc | 9 |
  | username_bla | 8 |
  | username_hsh | 4 |
  | ... | ... |
- `contributions.csv`
  
  Format:

  | Contributor | Contribution | Date |
  | ---         | ---          | :--  |
  | username_xyz | \[JS\] Topic: ------------ | XX-XX-XXXX (ISO String) |
  | username_abc | \[JS\] Topic: ------------  | XX-XX-XXXX (ISO String) |
  | username_bla | \[JS\] Other: ------------  | XX-XX-XXXX (ISO String) |
  | username_hsh | \[JS\] Fix: ------------  | XX-XX-XXXX (ISO String) |
  | ... | ... |

# Made with ❤ by [Param](https://www.paramsid.com).