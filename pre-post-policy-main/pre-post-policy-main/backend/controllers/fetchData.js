import { excelDataContainer } from "../config/db.config.js";

export const  fetchDataController = async(req,res)=>{
     try {
          
          // Define your query
          const querySpec = {
            //   query: "SELECT * from c"  
        //   query:"SELECT * FROM c ORDER BY c.createdAt ASCN OFFSET 0 LIMIT 5"
        query:"SELECT * FROM c WHERE IS_DEFINED(c.policyNo)"
          };
  
          // Fetch data from Cosmos DB
          const { resources: items } = await excelDataContainer.items.query(querySpec).fetchAll();
  
        //   // Send the fetched items in the response
          
        //   res.status(200).json(items);

            // Clean the items by removing metadata fields
    const cleanedItems = items.map(({ _etag, _rid, _self, _ts, _attachments, ...cleanItem }) => cleanItem);

    // Send the cleaned items in the response
    res.status(200).json(cleanedItems);

      } catch (error) {
          console.error("Error fetching data:", error.message);
          res.status(500).json({ error: "An error occurred while fetching data" });
      }
}