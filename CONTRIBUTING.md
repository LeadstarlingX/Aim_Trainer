# Contributing to Aim Trainer

First off, thank you for considering contributing to the Aim Trainer! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## How Can I Contribute?

### Reporting Bugs
- Check the issues tab to see if the bug has already been reported.
- If not, open a new issue with a clear title and description, including steps to reproduce the bug and your browser environment.

### Suggesting Enhancements
- Open an issue to discuss your idea before implementing it.
- Describe the feature you'd like to see and why it would be useful.

### Pull Requests
1. **Fork** the repository.
2. Create a **feature branch** (`git checkout -b feat/amazing-feature`).
3. **Commit** your changes following a clear convention (e.g., `feat: add awesome feature`).
4. **Test** your changes locally by running `npm test`. **Passes are mandatory.**
5. **Push** to the branch (`git push origin feat/amazing-feature`).
6. Open a **Pull Request**.

## Technical Guidelines
- **Automated Testing**: All new features or bug fixes **must** include corresponding tests. Run `npm test` to verify the entire suite passes before submitting a PR.
- **D3.js Patterns**: This project uses **D3.js v7**. Ensure all animations and data-driven elements use D3 patterns.
- **Design Consistency**: Follow the **Dark Theme** design guidelines. Use the defined CSS variables in `styles.css`.
- **Pure Front-end**: Keep the implementation **front-end only** (Vanilla JS/HTML/CSS).

## Branching Strategy
- `master`: Stable production code.
- `development`: Main development stream.
- `feat/*`: Specific feature or bug-fix branches.

Thank you for your help!
