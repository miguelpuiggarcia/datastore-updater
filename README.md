# 🎯 Google Cloud Datastore JS Updater

Update Datastore entity fields in bulk specifying a filter to search for and fields to update

## Before you begin

[https://console.cloud.google.com/project?_ga=2.184610537.1325311943.1657533922-619361646.1655407287](Select or create a Cloud Platform project.)
[https://console.cloud.google.com/flows/enableapi?apiid=datastore.googleapis.com&_ga=2.184610537.1325311943.1657533922-619361646.1655407287](Enable the Google Cloud Datastore API.)
[https://cloud.google.com/docs/authentication/getting-started](Set up authentication with a service account so you can access the API from your local workstation.)

## How to Use

Log in with your GCP credentials

`gcloud auth application-default login`

Change `/config.js` with your configuration

Default values:

```json
{
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
      val: true,ƒ
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
}
```

😎 Run

`node index.js`
