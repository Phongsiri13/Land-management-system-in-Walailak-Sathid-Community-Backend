const {
  getDataFromDB,
  insertDataToDB,
  getLikeSearchFromDB,
  getSearchDataFromDB,
} = require("../config/config_db");

const heirModel = {
  getHeirById: async (heir_id) => {
    const query = "SELECT * FROM heir WHERE heir_id = ? LIMIT 1";
    const resultsHeir = await getSearchDataFromDB(query, heir_id);
    return resultsHeir
  },

  getFullnameHeir: async (fullname) => {
    console.log("fullname:", fullname);

    const query = "SELECT * FROM heir WHERE first_name = ? AND last_name = ?";
    const resultsHeir = await getSearchDataFromDB(query, fullname);
    if (resultsHeir.length > 0) {
      return true; // If there are matching heirs, return true
    } else {
      return false; // If no match is found, return false
    }
  },

  getSearchFullHeirs: async (heirList) => {
    console.log("fullname:", heirList);

    // Create an array of conditions for matching first_name and last_name pairs
    const conditions = heirList.map((heir) => {
      return `(first_name = ? AND last_name = ?)`;
    });

    // Flatten the heirList values (first name and last name pairs)
    const values = heirList.flatMap((heir) => [heir.fname, heir.lname]);

    // Update the query to use the pair-wise conditions
    const query = `SELECT * FROM heir WHERE ${conditions.join(" OR ")}`;

    const resultsHeir = await getSearchDataFromDB(query, values);
    // Check if all heirs are found
    const notFoundNames = heirList.filter((heir) => {
      return !resultsHeir.some(
        (result) =>
          result.first_name === heir.fname && result.last_name === heir.lname
      );
    });

    if (notFoundNames.length > 0) {
      // If some heirs are not found, return those names
      return { success: false, notFound: notFoundNames };
    }
    {
      const foundHeirIds = resultsHeir.map((result) => {
        // Find the matching heir data based on first_name and last_name
        const match = heirList.find(
          (heir) =>
            heir.fname === result.first_name && heir.lname === result.last_name
        );

        // If a match is found, include relationSlected along with heir_id
        return match
          ? {
              heir_id: result.heir_id, // Include heir_id
              relationSlected: match.relationSlected, // Add relationSlected from heirData
            }
          : { heir_id: result.heir_id }; // Just include heir_id if no match found
      });
      return { success: true, heirs: foundHeirIds };
    }
  },

  addHeir: async (heirData) => {
    const query_heir = `INSERT INTO heir (
      first_name, last_name, prefix_id
    ) VALUES (?, ?, ?)`;
    // Step 1: Insert data to heir db
    const resultsHeir = await insertDataToDB(query_heir, heirData);
    return resultsHeir;
  },

  addHeirAll: async (data) => {
    const { heirsRelation, citizenIDCARD } = data;

    if (!heirsRelation.length) {
      throw new Error("No heirs provided.");
    }

    // Construct query with dynamic placeholders
    const query_heir = `
    INSERT INTO citizen_heir_relationship (citizen_id, heir_id, relationship_id)
    VALUES ${heirsRelation.map(() => "(?, ?, ?)").join(", ")}
  `;
    // Flatten array into values for SQL placeholders
    const values = heirsRelation.flatMap((heir) => [
      citizenIDCARD,
      heir.heir_id,
      heir.relationSlected,
    ]);

    // Execute the batch insert query
    const resultsHeir = await insertDataToDB(query_heir, values);
    return resultsHeir;
  },
};

module.exports = heirModel;
