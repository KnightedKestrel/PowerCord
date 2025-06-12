import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { globalIgnores } from "eslint/config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
    baseDirectory: dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends('eslint:recommended', 'prettier'),

    globalIgnores([
		"**/.nuxt",
		"**/.data",
		"**/.output",
	]),

    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: 2021,
            sourceType: 'commonjs',
        },

        rules: {
            'no-console': 'warn',
            'no-empty-function': 'error',
            'no-return-assign': 'error',

            'no-shadow': [
                'error',
                {
                    allow: ['err', 'resolve', 'reject'],
                },
            ],

            'prefer-const': 'warn',
        },
    },
];
