// eslint.config.js

module.exports = {
    ignores: ['node_modules', 'dist', 'build', 'dist-ssr', 'public', 'public-ssr',],
    overrides: [
        {
            files: ['**/*.{js,jsx,ts,tsx}'], // Especifica aquí las extensiones de archivo que deseas analizar
            // ... otras configuraciones específicas para estos archivos ...
            rules: {
                // Coloca tus reglas de ESLint aquí, por ejemplo:
                'prettier/prettier': 'error',
                'react-hooks/rules-of-hooks': 'error',
                'react-hooks/exhaustive-deps': 'warn',
            },


        },
    ],
};
