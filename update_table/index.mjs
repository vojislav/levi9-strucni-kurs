import AWS from 'aws-sdk'

export const handler = async(event) => {
    const dynamodb = new AWS.DynamoDB({ region: "eu-central-1" })
    const s3 = new AWS.S3({region: 'eu-central-1'})
    //console.log(event.Records[0].s3)
    const key = event.Records[0].s3.object.key
    //const key = "M16Pillar_WebbOzsarac_960.jpg"
    //const key = "art001e002132_apod1024.jpg"
    const bucket_name = "nasa-slike"
    var params = {Bucket: bucket_name, Key: key};
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
                S: key
            }
        },
        ReturnValues: "ALL_NEW", 
        TableName: "NASA_slike",
        UpdateExpression: "SET #IU = :iu"
    };

    let updateItemPromise = await dynamodb.updateItem(params).promise()
    console.log(updateItemPromise)
};