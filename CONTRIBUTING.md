# Contributing to Movie Land

Thanks for your interest in improving Movie Land! Every bug report, idea and pull request is appreciated.

## Getting set up

1. Fork the repository and clone your fork.
2. Install and configure the app (details in the [README](README.md#getting-started)):

   ```bash
   cd tiDolist
   npm install
   cp .env.example .env   # add your own Supabase credentials
   npm run dev
   ```

## Workflow

1. Create a branch from `main` with a descriptive name:
   `feat/article-search`, `fix/mobile-menu`, `docs/readme-typo`
2. Make your changes in small, focused commits.
3. Before pushing, make sure both of these pass from the `tiDolist/` folder:

   ```bash
   npm run lint
   npm run build
   ```

4. Open a pull request against `main` and fill in the template.

## Commit messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add category filter to the articles page
fix: prevent empty title from being submitted
docs: update Supabase setup instructions
refactor: extract article card into its own component
```

## Code style

- Use functional components and React hooks.
- Keep one component per folder with its own `.css` file.
- Give components, handlers and state variables clear names.
- Keep the UI right-to-left friendly and test on a narrow mobile viewport.
- Never commit secrets. Use environment variables and update `.env.example` when you add one.

## Reporting bugs and requesting features

Please use the [issue templates](../../issues/new/choose) and include as much detail as you can: steps to reproduce, what you expected, what happened, and screenshots if relevant.
