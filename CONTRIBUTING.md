# Contributing

Thank you for taking the time to look to contribute to PowerCord. Below are some additional instructions on setting up the project in a way that allows for code contributions, as well as information on reporting bugs and making suggestions.

## Getting Started

To get started with repo setup, follow these steps:

1. **Fork the Repository**: Fork into your own GitLab account.

2. **Clone Your Fork**: Clone to work locally or use the web editor in your new fork.

3. **Run Project**: Follow setup instructions in [README](README.md).

## Project Structure

This repo contains the contents for both the Discord bot and its website.

- `/`: Root directory that contains many helpful npm commands for formatting, tests, and running both applications in a dev environment.
- `/bot`: Source code for the bot and all utilities it needs.
- `/web`: Source code for the website.

## How to Contribute

### Reporting Bugs

If you encounter a bug or have a feature request, you can open a new issue. To be able to quickly assist in fixing it, please include as much detail as possible:

- Steps to reproduce the issue
- Expected and actual behavior
- Screenshots if available

### Code Contributions

1. **Branching**: Create a new branch for your work.

2. **Follow Code Style**: Prettier and ESLint is configured for this project. Run the following from root to quickly format all your changes made.

    ```bash
    npm run format
    ```

3. **Run Tests**: Writing new tests is not required/expected. Run existing tests to ensure existing features have not been impacted.

    ```bash
    npm test
    ```

4. **Open a Merge Request (MR)**: Provide info on your changes and feel free to reference any related issues.

## Contact

For questions or assistance, feel free to open an issue or join the discussion on any existing issues.
