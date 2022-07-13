module.exports = {
  dryRun: true, // True won't perform the save, just fake it
  projectId: "prod-nandos-id-1f3c2e0c",
  datastore: {
    method: "update", // Update (won't create new object) or Save (will upsert the object)
    namespace: "profile-management-api",
    kind: "customer-deletion-status",
    limit: 200, // Query Datastore (max 200)
    filter: {
      key: "complete",
      operand: "=",
      val: true,
    },
    filesToUpdate: [
      // Array of fields to update with
      {
        fieldName: "complete",
        fieldValue: true,
      },
    ],
  },
  chunkSize: 200,
};
