import { restoreDb } from "../src/config/config";
import { db } from "../src/infraestructure/sequelize/models/index";

let testDBConnection = async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

async function checkDBStatus() {
  await testDBConnection();
  //await dbUtils.createFarmProducts()
  if (restoreDb) {
    // console.log("Returning 4 Safety reasons")
    return;

    // Comment ^ to delete all tables :O

    // console.log("DB_RESTORE is true; Performing drop & load...")
    // await db.sync({ force: true })

    // Load data here

    console.log("DB Restored correctly");
  } else {
    console.log("No DB Restore");
  }
}

checkDBStatus();
