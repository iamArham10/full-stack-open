import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
    { ignores: ["dist"] },
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
                sourceType: "module",
            },
        },
        settings: {
            react: { version: "detect" },
        },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs["jsx-runtime"].rules,
            ...reactHooks.configs.recommended.rules,
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            eqeqeq: "error",
            "no-console": "off",
            "no-trailing-spaces": "error",
            "object-curly-spacing": ["error", "always"],
            "arrow-spacing": ["error", { before: true, after: true }],
            indent: ["error", 4],
            "linebreak-style": ["error", "unix"],
            quotes: ["error", "double"],
            semi: ["error", "always"],
            "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
        },
    },
    {
        files: ["**/*.test.{js,jsx}"],
        languageOptions: {
            globals: { ...globals.vitest },
        },
    },
];
