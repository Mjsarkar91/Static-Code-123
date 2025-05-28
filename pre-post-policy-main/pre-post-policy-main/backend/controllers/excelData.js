// import { excelDataContainer } from "../config/db.config.js";
// export const excelDataController =async(req,res)=>{
//     const {parsedData} = req.body;
//     const savedData = [];
//     try {
//         for (let item of parsedData) {
//             const { resource:items }=  await excelDataContainer.items.upsert(item);
//           savedData.push(items);
//         }
//         res.status(200).send(savedData);
//       } catch (error) {
//         console.error('Error inserting data into Cosmos DB:', error);
//         res.status(500).send('Error inserting data');
//       }
// }


import { excelDataContainer } from "../config/db.config.js";

export const excelDataController = async (req, res) => {
  const { parsedData } = req.body;
  const savedData = [];

  try {
    for (let item of parsedData) {
      // Upsert the item into Cosmos DB
      const { resource: items } = await excelDataContainer.items.upsert(item);

      // Destructure and remove the unwanted metadata fields
      const { _etag, _rid, _self, _ts, _attachments,id, ...cleanItem } = items;

      // Push the cleaned item into the savedData array
      savedData.push(cleanItem);
    }

    // Send the response with the cleaned data
    res.status(200).send(savedData);
  } catch (error) {
    console.error('Error inserting data into Cosmos DB:', error);
    res.status(500).send('Error inserting data');
  }
};

