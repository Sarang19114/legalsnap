# Database Schema Migration Instructions

## Problem

Your database has the old schema with `createdOn` (varchar), but the code expects `createdAt` and `updatedAt` (timestamp). This is causing the 500 error.

## Solution

You have two options:

### Option 1: Run Migration Script (Recommended)

Run the migration script to update your database schema:

```bash
# Connect to your PostgreSQL database and run:
psql -d your_database_name -f migrations/002_fix_schema_immediate.sql
```

Or if using a cloud database (Neon, Supabase, etc.), copy the contents of `migrations/002_fix_schema_immediate.sql` and run it in your database SQL editor.

### Option 2: Manual SQL (Quick Fix)

Run these SQL commands directly in your database:

```sql
-- Add createdAt column
ALTER TABLE "sessionChatTable" 
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT NOW();

-- Populate createdAt from createdOn if it exists
UPDATE "sessionChatTable" 
SET "createdAt" = COALESCE(
    CASE 
        WHEN "createdOn" ~ '^\d{4}-\d{2}-\d{2}' THEN "createdOn"::timestamp
        ELSE NULL
    END,
    NOW()
)
WHERE "createdAt" IS NULL;

-- Make createdAt NOT NULL
ALTER TABLE "sessionChatTable" 
ALTER COLUMN "createdAt" SET NOT NULL;

-- Add updatedAt column
ALTER TABLE "sessionChatTable" 
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT NOW();

-- Populate updatedAt
UPDATE "sessionChatTable" 
SET "updatedAt" = COALESCE("createdAt", NOW())
WHERE "updatedAt" IS NULL;

-- Make updatedAt NOT NULL
ALTER TABLE "sessionChatTable" 
ALTER COLUMN "updatedAt" SET NOT NULL;

-- Remove old createdOn column (optional, after verifying everything works)
-- ALTER TABLE "sessionChatTable" DROP COLUMN IF EXISTS "createdOn";
```

## Verify Migration

After running the migration, verify the schema:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sessionChatTable'
ORDER BY ordinal_position;
```

You should see:
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- No `createdOn` column (or it will be removed)

## After Migration

1. Restart your Next.js development server
2. Try creating a session again
3. The 500 error should be resolved

## Rollback (if needed)

If something goes wrong, you can rollback:

```sql
-- Remove new columns
ALTER TABLE "sessionChatTable" DROP COLUMN IF EXISTS "createdAt";
ALTER TABLE "sessionChatTable" DROP COLUMN IF EXISTS "updatedAt";
```

