export const loadConfig = async (processEnv: any) => {
  const config = {
    httpPort: parseInt(processEnv.HTTP_PORT) || 8080,
    database: {
      type: processEnv.DB_TYPE || 'mysql',
      host: processEnv.DB_HOST || 'localhost',
      port: processEnv.DB_PORT || 3306,
      username: processEnv.DB_USERNAME || 'recipot',
      password: processEnv.DB_PASSWORD || 'recipot1!11',
      database: processEnv.DB_DATABASE || 'recipot',
    },
    swagger: {
      title: processEnv.SWAGGER_TITLE || 'Recipot API',
      description: processEnv.SWAGGER_DESCRIPTION || 'Recipot API Document',
      version: processEnv.SWAGGER_VERSION || '1.0.0',
      path: processEnv.SWAGGER_PATH || '/api/document',
      json: processEnv.SWAGGER_JSON || '/api/json',
    },
  };

  return config;
};
