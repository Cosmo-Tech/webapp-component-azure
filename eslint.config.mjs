import prettier from "eslint-plugin-prettier";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/build", "**/dist", "**/.docz", "**/.github", "**/node_modules"],
}, ...compat.extends(
    "standard",
    "eslint:recommended",
    "prettier",
    "plugin:prettier/recommended",
), {
    plugins: {
        prettier,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        ecmaVersion: 12,
        sourceType: "module",
    },

    rules: {
        "no-constant-binary-expression": "error",
        semi: [2, "always"],

        "max-len": ["error", {
            code: 120,
        }],
    },
}];