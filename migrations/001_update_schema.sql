-- Database migration script for LegalSnap
-- This script updates the existing schema to match the new structure

-- Step 1: Add unique constraint to sessionId if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'sessionChatTable_sessionId_unique' 
        AND table_name = 'sessionChatTable'
    ) THEN
        ALTER TABLE "sessionChatTable" ADD CONSTRAINT "sessionChatTable_sessionId_unique" UNIQUE ("sessionId");
    END IF;
END $$;

-- Step 2: Add default value to credits column if it doesn't exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'credits') THEN
        ALTER TABLE "users" ALTER COLUMN "credits" SET DEFAULT 10;
    END IF;
END $$;

-- Step 3: Add createdAt column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sessionChatTable' AND column_name = 'createdAt') THEN
        -- If createdOn exists, migrate data from it
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sessionChatTable' AND column_name = 'createdOn') THEN
            -- Add createdAt as nullable first
            ALTER TABLE "sessionChatTable" ADD COLUMN "createdAt" TIMESTAMP;
            
            -- Migrate data from createdOn to createdAt (try to parse varchar to timestamp)
            UPDATE "sessionChatTable" 
            SET "createdAt" = CASE 
                WHEN "createdOn" ~ '^\d{4}-\d{2}-\d{2}' THEN "createdOn"::timestamp
                ELSE NOW()
            END
            WHERE "createdAt" IS NULL;
            
            -- Make it NOT NULL with default
            ALTER TABLE "sessionChatTable" 
                ALTER COLUMN "createdAt" SET NOT NULL,
                ALTER COLUMN "createdAt" SET DEFAULT NOW();
        ELSE
            -- No createdOn, just add createdAt with default
            ALTER TABLE "sessionChatTable" ADD COLUMN "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL;
        END IF;
    END IF;
END $$;

-- Step 4: Add updatedAt column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sessionChatTable' AND column_name = 'updatedAt') THEN
        -- If createdOn exists, use it as a base, otherwise use NOW()
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sessionChatTable' AND column_name = 'createdOn') THEN
            ALTER TABLE "sessionChatTable" ADD COLUMN "updatedAt" TIMESTAMP;
            
            -- Set updatedAt based on createdOn or createdAt
            UPDATE "sessionChatTable" 
            SET "updatedAt" = COALESCE(
                "createdAt",
                CASE 
                    WHEN "createdOn" ~ '^\d{4}-\d{2}-\d{2}' THEN "createdOn"::timestamp
                    ELSE NOW()
                END,
                NOW()
            )
            WHERE "updatedAt" IS NULL;
            
            ALTER TABLE "sessionChatTable" 
                ALTER COLUMN "updatedAt" SET NOT NULL,
                ALTER COLUMN "updatedAt" SET DEFAULT NOW();
        ELSE
            ALTER TABLE "sessionChatTable" ADD COLUMN "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL;
        END IF;
    END IF;
END $$;

-- Step 5: Remove old createdOn column if it exists (after migration)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'sessionChatTable' AND column_name = 'createdOn') THEN
        ALTER TABLE "sessionChatTable" DROP COLUMN "createdOn";
    END IF;
END $$;

-- Step 6: Remove user column if it exists (not used in new schema)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'sessionChatTable' AND column_name = 'user') THEN
        ALTER TABLE "sessionChatTable" DROP COLUMN "user";
    END IF;
END $$;


