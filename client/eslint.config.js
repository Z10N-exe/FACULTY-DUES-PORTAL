import { TannurClient } from '@tannur/sdk';
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])


const tannur = new TannurClient({
  apiKey: 'e108166dccfce78ba4f94e868dd09cbbf9e8134678d5431546aac209dea4f146',
  streamId: 'str_c9f65c352a8230db',
});

// Track events
tannur.events.publish({
  type: 'user.action',
  data: { /* your event data */ }
});
