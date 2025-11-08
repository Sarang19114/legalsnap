-- Verify schema migration
-- Run this to check if createdAt and updatedAt columns were added

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'sessionChatTable'
ORDER BY ordinal_position;

