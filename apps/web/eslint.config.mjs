import nextConfig from 'eslint-config-next/core-web-vitals';

export default [
  ...nextConfig,
  {
    rules: {
      // useHasMounted is a standard pattern; ref passing in cloneElement is intentional
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
];
