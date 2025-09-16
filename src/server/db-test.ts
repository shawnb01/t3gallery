import { db } from "./db";

export async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...");
    
    // Test basic connection
    await db.$connect();
    console.log("✅ Database connection established");
    
    // Test a simple query
    const imageCount = await db.image.count();
    console.log(`✅ Successfully queried database: ${imageCount} images found`);
    
    // Test connection info
    const result = await db.$queryRaw`SELECT version()`;
    console.log("✅ Database version:", result);
    
    return { success: true, imageCount };
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  } finally {
    await db.$disconnect();
    console.log("🔌 Database connection closed");
  }
}
