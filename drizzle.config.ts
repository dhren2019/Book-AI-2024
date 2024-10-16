import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: "./config/schema.tsx",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://aibook_owner:gNY9oZisyD8S@ep-blue-tree-a56lowjl.us-east-2.aws.neon.tech/aibook?sslmode=require'
  },
  verbose: true,
  strict: true,
})