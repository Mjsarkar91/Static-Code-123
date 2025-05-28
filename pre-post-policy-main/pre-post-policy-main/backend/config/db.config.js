import { CosmosClient } from "@azure/cosmos";
import dotenv from "dotenv";
dotenv.config();

const {
    COSMOSDB_URI,
    COSMOSDB_KEY,
    COSMOSDB_NETWORK,
} = process.env;

if (
    !COSMOSDB_URI ||
    !COSMOSDB_KEY ||
    !COSMOSDB_NETWORK 
) {
    throw new Error("Missing CosmosDB configuration");
}

const client = new CosmosClient({ endpoint: COSMOSDB_URI, key: COSMOSDB_KEY });

// NETWORK DB 1
const networkDb = client.database(COSMOSDB_NETWORK);
const excelDataContainer = networkDb.container("ticket");

export {
    excelDataContainer
};