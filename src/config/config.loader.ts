export const loadConfig = async (processEnv: any) => {
  const config = {
    database: {
      type: processEnv.DB_TYPE || 'mysql',
      host: processEnv.DB_HOST || 'localhost',
      port: processEnv.DB_PORT || 3306,
      username: processEnv.DB_USERNAME || 'recipot',
      password: processEnv.DB_PASSWORD || 'recipot1!11',
      database: processEnv.DB_DATABASE || 'recipot',
    },
  };

  return config;
};
