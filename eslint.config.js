import jsEslint from '@eslint/js'
import vueParser from 'vue-eslint-parser'
import pluginVue from 'eslint-plugin-vue'
import tsEslint from 'typescript-eslint'
import globals from 'globals'


export default [
  jsEslint.configs.recommended,
  ...tsEslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      'public/*/*.js',
      'webpack.config.js',
      'types/**/*.d.ts',
      'src/demo/utils/login.js'
    ]
  },
  {
    files: [
      'src/**/*.{js,jsx,ts,tsx,vue}',
      'public/*.js',
      'build/**/*.{js,ts}',
      './*.{js,ts}'
    ],
    plugins: {
      '@typescript-eslint': tsEslint.plugin
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsEslint.parser,
        jsxPragma: 'React',
        ecmaFeatures: {
          jsx: true
        }
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024
      }
    },
    rules: {
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'space-before-function-paren': ['error', 'always'],

      'vue/script-setup-uses-vars': 'error',
      'vue/max-attributes-per-line': 'off',
      'vue/require-default-prop': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/html-closing-bracket-spacing': ['error', { selfClosingTag: 'never' }],
      'vue/html-closing-bracket-newline': 'off',
      // '@typescript-eslint/explicit-function-return-type': 'off',
      // '@typescript-eslint/explicit-module-boundary-types': 'off',
      // '@typescript-eslint/no-var-requires': 'off',
      // '@typescript-eslint/no-empty-function': 'off',
      // '@typescript-eslint/ban-types': 'off',
      // 'vue/attributes-order': 'off',
      // 'vue/attribute-hyphenation': 'off',
      // 'vue/custom-event-name-casing': 'off',
      // 'vue/require-explicit-emits': 'off',
      // 'vue/one-component-per-file': 'off',
      // 'vue/multi-word-component-names': 'off',

      semi: ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      indent: ['error', 2, {
        SwitchCase: 1
      }],
      quotes: ['error', 'single'],
      'quote-props': ['error', 'as-needed'],
      'no-case-declarations': 'error',
      complexity: ['error', 25]
    }
  }
]
