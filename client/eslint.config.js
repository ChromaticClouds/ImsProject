// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

const jsxUsesVars = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      undefined: "'{{name}}' is not defined.",
    },
  },
  create(context) {
    const markJsxName = (name, node) => {
      const isMemberExpression = name.type === 'JSXMemberExpression';
      let rootName = name;

      while (rootName.type === 'JSXMemberExpression') {
        rootName = rootName.object;
      }

      if (
        rootName.type === 'JSXIdentifier' &&
        (isMemberExpression || /^[A-Z]/.test(rootName.name))
      ) {
        let scope = context.sourceCode.getScope(node);
        let variable;

        while (scope && !variable) {
          variable = scope.set.get(rootName.name);
          scope = scope.upper;
        }

        if (!variable) {
          context.report({
            node: rootName,
            messageId: 'undefined',
            data: { name: rootName.name },
          });
          return;
        }

        context.sourceCode.markVariableAsUsed(rootName.name, node);
      }
    };

    return {
      JSXOpeningElement(node) {
        markJsxName(node.name, node);
      },
      Program(node) {
        for (const comment of context.sourceCode.getAllComments()) {
          if (
            comment.type !== 'Block' ||
            !comment.value.trimStart().startsWith('*')
          ) {
            continue;
          }

          for (const name of comment.value.match(/[A-Za-z_$][\w$]*/g) ?? []) {
            context.sourceCode.markVariableAsUsed(name, node);
          }
        }
      },
    };
  },
};

export default defineConfig([
  globalIgnores([
    'dist',
    'storybook-static',
    'node_modules',
    'public/mockServiceWorker.js',
    '**/*.ts',
    '**/*.tsx',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      local: {
        rules: {
          'jsx-uses-vars': jsxUsesVars,
        },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'local/jsx-uses-vars': 'error',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'react-refresh/only-export-components': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
]);
