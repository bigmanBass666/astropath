import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import parserVue from 'vue-eslint-parser'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    }
  },
  {
    files: ['**/*.vue', '**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        Promise: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
        Array: 'readonly',
        Object: 'readonly',
        String: 'readonly',
        Number: 'readonly',
        Boolean: 'readonly',
        Date: 'readonly',
        Math: 'readonly',
        JSON: 'readonly',
        RegExp: 'readonly',
        Error: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        location: 'readonly',
        navigator: 'readonly',
        process: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        confirm: 'readonly',
        alert: 'readonly',
        prompt: 'readonly',
        Notification: 'readonly',
        AbortController: 'readonly',
        TextDecoder: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        btoa: 'readonly',
        atob: 'readonly',
        IntersectionObserver: 'readonly',
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        KeyboardEvent: 'readonly',
        Node: 'readonly',
        Text: 'readonly',
        Event: 'readonly',
        performance: 'readonly',
        Element: 'readonly'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-unused-vars': 'warn',
      'no-unused-vars': 'warn',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  {
    ignores: ['node_modules/', 'dist/', 'build/', '*.config.js']
  }
]
