## local run

```bash
sh start.sh
```

## Docker compose

```bash
docker compose up
```

## Technology Stack

- React 19 with TypeScript
- Vite for build tooling and development
- React Router for navigation
- React Hook Form for form handling
- Vitest for testing
- Storybook for component documentation
- Sentry for error tracking and performance monitoring

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

````js
## Documentation

The codebase includes detailed documentation on various aspects of the application:

- [Sentry Integration Guide](docs/sentry.md) - Error tracking, performance monitoring, and session replay
- [Protected Routes](src/docs/protected-routes.md) - How authentication and protected routes work

## Development

To get started with development:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
````

    ...tseslint.configs.stylisticTypeChecked,

],
languageOptions: {
// other options...
parserOptions: {
project: ["./tsconfig.node.json", "./tsconfig.app.json"],
tsconfigRootDir: import.meta.dirname,
},
},
});

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
````
