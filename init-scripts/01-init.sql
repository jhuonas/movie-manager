-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance
-- These will be created automatically by TypeORM, but we can add custom ones here if needed

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE moviesdb TO postgres; 