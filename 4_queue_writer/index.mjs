import AWS from 'aws-sdk'

export const handler = async(event) => {
    const eventType = event.Records[0].eventName
    if (eventType != "MODIFY") {
        console.log("Event type is", eventType, "not MODIFY. Exiting.")
        return
    }

    const internal_url = event.Records[0].dynamodb.NewImage.internal_url
    if (internal_url == undefined){
        console.log("Internal URL not provided. Exiting.")
        return
    }

    var sqs = new AWS.SQS({region: 'eu-central-1'});
    let newRow = event.Records[0].dynamodb.NewImage

    var params = {
        MessageAttributes: {
            "title": {
                DataType: "String",
                StringValue: newRow.title.S
            },
            "date": {
                DataType: "String",
                StringValue: newRow.date.S
            },
            "filename": {
                DataType: "String",
                StringValue: newRow.filename.S
            },
            "url": {
                DataType: "String",
                StringValue: newRow.url.S
            },
            "internal_url":{
                DataType: "String",
                StringValue: newRow.internal_url.S
            },
            "explanation":{
                DataType: "String",
                StringValue: newRow.explanation.S
            }
        },
        MessageBody: "Info about the new table row",
        QueueUrl: "https://sqs.eu-central-1.amazonaws.com/316104588238/red"
    };

    return await sqs.sendMessage(params).promise()
};