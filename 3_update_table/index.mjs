import AWS from 'aws-sdk'

export const handler = async(event) => {
    const dynamodb = new AWS.DynamoDB({ region: "eu-central-1" })
    const s3 = new AWS.S3({region: 'eu-central-1'})

    const filename = event.Records[0].s3.object.key
    const bucket_name = "skinute-slike"
    var params = {Bucket: bucket_name, Key: filename, Expires: 43200};
    var internal_url = s3.getSignedUrl('getObject', params);

    console.log("INTERNAL URL:", internal_url)

    var params = {
        ExpressionAttributeNames: {
            "#IU": "internal_url"
        }, 
        ExpressionAttributeValues: {
            ":iu": {
                S: internal_url
            }
        }, 
        Key: {
            "filename": {
                S: filename
            }
        },
        ReturnValues: "ALL_NEW", 
        TableName: "nasa-slike",
        UpdateExpression: "SET #IU = :iu"
    };

    return await dynamodb.updateItem(params).promise()
};