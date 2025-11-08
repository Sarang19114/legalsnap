-- Optional: Remove old columns that are no longer used
-- Run this only after verifying everything works correctly

-- Remove old createdOn column (no longer needed)
ALTER TABLE "sessionChatTable" DROP COLUMN IF EXISTS "createdOn";

-- Remove user column if it exists (not used in new schema)
ALTER TABLE "sessionChatTable" DROP COLUMN IF EXISTS "user";

