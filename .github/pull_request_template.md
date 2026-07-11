## Description

<!-- Briefly describe what this PR changes and why. -->

**Trello Card:** [Paste Trello card link here]

## Type of change

Please check the options that are relevant:

- [ ] Backend
- [ ] Frontend
- [ ] DevOps / CI/CD / Configuration
- [ ] Documentation

## Backend changes

<!-- If this PR does not affect the backend, state "N/A" -->

- **API Endpoints:** (e.g. added POST /api/v1/users)
- **Database:** Does this PR require database migrations? [No/Yes - name of the migration and whether it is safe for the data]
- **Environment Variables:** Were any new keys added to the .env file? [Yes/No] (If yes, which ones?)

### 🚨 Breaking changes

Does this PR introduce breaking changes to the API or data structure?

- [ ] No
- [ ] Yes (If yes, describe what breaks and what actions other developers need to take, e.g. run migrations, clear local storage, seed fresh data)

## Frontend changes

<!-- If this PR does not affect the frontend, state "N/A" -->

- **UI/UX Impact:** (What is changing from the user's perspective?)
- **Responsiveness & a11y:** Were the changes tested on mobile and for accessibility? [Yes/No]

### Screenshots / GIFs (Required for UI changes)

| Before | After |
| :----- | :---- |
|        |       |

## How to test

<!-- Describe step-by-step how to run and test these changes locally. -->

1. Fetch the latest changes.
1. Install dependencies using command: `npm run install:all`.
1. Start the tests: `npm run test:all`.

## Pre-merge checklist

- [ ] Code is formatted and passes the linter locally.
- [ ] The code includes appropriate tests (unit/integration) if required.
- [ ] The `.env.example` file has been updated (if new variables have been added).
- [ ] The Trello card has been moved to the "Review" column.
