import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';

/**
 * Endpoint to check database schema and identify issues
 * GET /api/check-schema
 */
export async function GET(req: NextRequest) {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        error: "DATABASE_URL not configured",
        schema: null
      }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Query the information_schema to get table structure
    const schemaQuery = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'sessionChatTable'
      ORDER BY ordinal_position;
    `;

    // Execute raw query to get schema info
    const schemaResult: any = await sql(schemaQuery);
    
    // Check for required columns
    const columns = Array.isArray(schemaResult) ? schemaResult : [];
    const columnNames = columns.map((col: any) => col.column_name);
    
    const hasCreatedAt = columnNames.includes('createdAt');
    const hasUpdatedAt = columnNames.includes('updatedAt');
    const hasCreatedOn = columnNames.includes('createdOn');
    const hasUser = columnNames.includes('user');
    
    const issues: string[] = [];
    const warnings: string[] = [];
    
    if (!hasCreatedAt) {
      issues.push("Missing 'createdAt' column (timestamp)");
    }
    
    if (!hasUpdatedAt) {
      issues.push("Missing 'updatedAt' column (timestamp)");
    }
    
    if (hasCreatedOn) {
      warnings.push("Old 'createdOn' column still exists (should be migrated to createdAt)");
    }
    
    if (hasUser) {
      warnings.push("Old 'user' column still exists (not used in new schema)");
    }
    
    return NextResponse.json({
      status: issues.length === 0 ? "ok" : "needs_migration",
      schema: {
        columns: columns,
        columnNames: columnNames,
        hasRequiredColumns: hasCreatedAt && hasUpdatedAt,
        issues: issues,
        warnings: warnings
      },
      migrationNeeded: issues.length > 0 || warnings.length > 0,
      migrationScript: "Run migrations/002_fix_schema_immediate.sql to fix schema issues",
      instructions: "See MIGRATION_INSTRUCTIONS.md for detailed migration steps"
    });
  } catch (error) {
    console.error("Error checking schema:", error);
    return NextResponse.json({
      error: "Failed to check schema",
      details: error instanceof Error ? error.message : String(error),
      schema: null
    }, { status: 500 });
  }
}

