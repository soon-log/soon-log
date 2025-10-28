# Coding_Style_Guidelines

## Environment & Tooling

- Use pnpm for dependency installation and test execution.
  - ex) pnpm install ..., pnpm test ...
- Prioritize shadcn when adding UI components. Instead of installing libraries like @radix-ui directly, use pnpm dlx shadcn@latest add [component-name]. This ensures consistent component styling and configuration across the project.

## Code Style & Conventions

- Generated code must comply with ESLint rules.
- When using array types, use the Array<Type> syntax.
- When writing test code, use test instead of it.

## Development Process

- For development requirements, write pseudocode first.
- Then, write test code based on the pseudocode.
- Finally, write the code that passes those tests.
