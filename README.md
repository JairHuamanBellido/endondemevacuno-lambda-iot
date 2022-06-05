# AWS-IOT-LAMBDA
## Install
```
npm install
```


## Deploy

```
// Generate a build
npm run compile

// Build an artifact
sam build

// Remove folder
rm -rf .aws-sam

// Deploy the lambda
sam deploy --s3-bucket <<bucket_name>
```
