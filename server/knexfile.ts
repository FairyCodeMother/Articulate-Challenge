// Update with your config settings.

export default {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    tableName: 'knex_migrations',
  },
}
