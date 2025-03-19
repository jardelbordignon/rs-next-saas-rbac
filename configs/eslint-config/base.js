import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";
import importPlugin from 'eslint-plugin-import-x';
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "../prettier-config/index.mjs";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "prettier/prettier": ["error", prettierConfig],
      "no-console": "warn", // Evita logs desnecessários em produção
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Ignora variáveis iniciadas com _
      "eqeqeq": ["error", "always"], // Exige uso de === e !==
      // "curly": "error", // Força uso de chaves em blocos condicionais
      "prefer-const": "warn", // Sugere const em vez de let sempre que possível
      // "@typescript-eslint/explicit-function-return-type": "warn", // Exige definição de tipo de retorno em funções
      "@typescript-eslint/no-explicit-any": "warn", // Evita uso de `any`
      "@typescript-eslint/no-non-null-assertion": "error", // Evita `!` em valores possivelmente `null`
      "@typescript-eslint/consistent-type-imports": "error", // Garante imports consistentes de tipos
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'object', 'type'],
          'newlines-between': 'never',
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
        },
      ],
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: true,
          ignoreDeclarationSort: true,
        },
      ],
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", "*.config.js"],
  },
];
