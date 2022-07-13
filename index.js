const { Datastore } = require("@google-cloud/datastore");
const _ = require("lodash");
const config = require("./config");

const datastore = new Datastore({
  projectId: config.projectId,
});

async function datastoreQuery(endCursor = null) {
  try {
    const query = datastore.createQuery(
      config.datastore.namespace,
      config.datastore.kind
    );
    query.filter(
      config.datastore.filter.key,
      config.datastore.filter.operand,
      config.datastore.filter.val
    );
    query.limit(config.datastore.limit);
    if (endCursor) {
      query.start(endCursor);
    }

    const result = await datastore.runQuery(query);

    return result;
  } catch (error) {
    throw error;
  }
}

async function getResults() {
  console.log("Getting results based on filters");
  try {
    let page = null;
    let results = [];
    let lastResult = [];
    do {
      try {
        const resp = await datastoreQuery(page);
        lastResult = resp[1];
        resp[0].forEach((item) => {
          results.push(item);
        });
        page = lastResult.endCursor;
      } catch (error) {
        throw error;
      }
    } while (lastResult.moreResults === "MORE_RESULTS_AFTER_LIMIT");
    return results;
  } catch (error) {
    throw error;
  }
}

async function updateBatch(batch) {
  try {
    const formattedEntities = batch.map(function (item) {
      for (const updateField of config.datastore.filesToUpdate) {
        item[updateField.fieldName] = updateField.fieldValue;
      }
      return {
        key: item[datastore.KEY],
        data: item,
      };
    });
    if (config.dryRun) {
      console.log(`DRY RUN!!!, updated ${formattedEntities.length} entities`);
      console.log(" Waiting 2 seconds...");
      sleep(2000);
      return;
    } else {
      if (config.datastore.method === "update") {
        return await datastore.update(formattedEntities);
      } else {
        return await datastore.save(formattedEntities);
      }
    }
  } catch (error) {
    throw error;
  }
}

(async function () {
  try {
    const results = await getResults();
    if (results.length === 0) {
      return console.log(
        `No records found with filter ${JSON.stringify(
          config.datastore.filter
        )} on ${config.datastore.namespace} namespace and ${
          config.datastore.kind
        } kind, exiting.`
      );
    }
    const chunkedResults = _.chunk(results, config.chunkSize);
    console.log("Config: ", config);
    console.log("TOTAL results: ", results.length);
    console.log("TOTAL chunks of records: ", chunkedResults.length);
    sleep(2000);
    console.log(
      `We will be updating a total of ${results.length} datastore records in batches of ${config.chunkSize}`
    );
    sleep(3000);
    console.log("Starting in 5 seconds...");

    sleep(5000);

    for (let i = 0; i < chunkedResults.length; i++) {
      const updateResult = await updateBatch(chunkedResults[i]);
      console.log(updateResult);
    }
  } catch (error) {
    console.error(error);
  }
})();

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
