module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/function-component-definition': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-filename-extension': 'off',
    'react/require-default-props': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandFirst: true,
        ignoreCase: true,
      },
    ],
    'max-len': [
      'error',
      {
        code: 130,
        tabWidth: 4,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'max-params': ['error', 3],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
          'unknown',
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '*.scss',
            group: 'sibling',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        '': 'never',
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
