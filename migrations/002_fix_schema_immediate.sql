-- Immediate fix for schema mismatch
-- Run this if you're getting errors about createdAt/updatedAt not existing

-- Add createdAt if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sessionChatTable' AND column_name = 'createdAt') THEN
        ALTER TABLE "sessionChatTable" ADD COLUMN "createdAt" TIMESTAMP DEFAULT NOW();
        
        -- Populate from createdOn if it exists, otherwise use NOW()
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sessionChatTable' AND column_name = 'createdOn') THEN
            UPDATE "sessionChatTable" 
            SET "createdAt" = COALESCE(
                CASE 
                    WHEN "createdOn" ~ '^\d{4}-\d{2}-\d{2}' THEN "createdOn"::timestamp
                    ELSE NULL
                END,
                NOW()
            )
            WHERE "createdAt" IS NULL;
        END IF;
        
        ALTER TABLE "sessionChatTable" ALTER COLUMN "createdAt" SET NOT NULL;
    END IF;
END $$;

-- Add updatedAt if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sessionChatTable' AND column_name = 'updatedAt') THEN
        ALTER TABLE "sessionChatTable" ADD COLUMN "updatedAt" TIMESTAMP DEFAULT NOW();
        
        -- Set to same as createdAt or NOW()
        UPDATE "sessionChatTable" 
        SET "updatedAt" = COALESCE("createdAt", NOW())
        WHERE "updatedAt" IS NULL;
        
        ALTER TABLE "sessionChatTable" ALTER COLUMN "updatedAt" SET NOT NULL;
    END IF;
END $$;

