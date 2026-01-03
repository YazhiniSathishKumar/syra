module.exports = {
  apps: [
    {
      name: 'cyber-api',
      script: 'server.ts',
      interpreter: 'npx',
      interpreter_args: 'ts-node',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
