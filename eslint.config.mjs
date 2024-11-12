/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylisticTs from '@stylistic/eslint-plugin-ts'
import preferLet from 'eslint-plugin-prefer-let'

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['*.js', '*.mjs', '*.cjs'],
                    defaultProject: 'tsconfig.eslint.json',
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            '@stylistic/ts': stylisticTs,
            'prefer-let': preferLet,
        },
        rules: {
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@/space-before-function-paren': ['error', { 'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always' }],
            '@/keyword-spacing': ['error', { 'before': true, 'after': true }],
            '@/brace-style': ['error', '1tbs'],
            '@/space-before-blocks': ['error', 'always'],
            '@stylistic/ts/type-annotation-spacing':  ['error', { 'before': false, 'after': true, 'overrides': { 'arrow': { 'before': true, 'after': true } } }],
            '@/arrow-parens': ['error', 'always'],
            '@/no-multi-spaces': ['error'],
            '@/arrow-spacing': ['error'],
            '@/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
            '@/no-tabs': ['error'],
            '@/no-trailing-spaces': ['error'],
            '@/space-in-parens': ['error', 'never'],
            'no-console': ['error', { allow: ['error'] }],
            'indent': ['error', 4],
            'no-continue': 'off',
            'max-len': 'off',
            'func-names': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'error',
            '@typescript-eslint/no-unsafe-return': 'error',
            '@typescript-eslint/no-var-requires': 'error',
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'variable',
                    format: ['camelCase'],
                },
                {
                    selector: 'parameter',
                    format: ['camelCase'],
                },
                {
                    selector: 'function',
                    format: ['PascalCase'],
                },
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                },
            ],
            '@/indent': ['error', 4],
            quotes: ['error', 'single'],
            '@/quotes': ['error', 'single'],
            '@/comma-dangle': [
                'error',
                {
                    arrays: 'always-multiline',
                    objects: 'always-multiline',
                    imports: 'always-multiline',
                    exports: 'always-multiline',
                    functions: 'always-multiline',
                },
            ],
            'comma-dangle': [
                'error',
                {
                    arrays: 'always-multiline',
                    objects: 'always-multiline',
                    imports: 'always-multiline',
                    exports: 'always-multiline',
                    functions: 'always-multiline',
                },
            ],
            'require-await': 'off',
            '@typescript-eslint/require-await': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
            'prefer-const': 'off',
            'prefer-let/prefer-let': 2,
            'prefer-template': 'error',
            '@typescript-eslint/restrict-plus-operands': 'off',
            'template-curly-spacing': ['error', 'never'],
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/prefer-for-of': 'off',
            'no-restricted-syntax': [
                'error',
                {
                    'selector': 'ClassDeclaration',
                    'message': 'Classes are not supported in Rhino',
                },
            ],
            'comma-spacing': ['error', { 'before': false, 'after': true }],
            '@/spaced-comment': ['error', 'always', { 'markers': ['/'] }],
            '@/line-comment-position': ['error', { 'position': 'above' }],
            'complexity': 'error',
            'max-statements': ['error', 25],
            'no-nested-ternary': 'error',
            'consistent-return': 'error',
        },
    },
);