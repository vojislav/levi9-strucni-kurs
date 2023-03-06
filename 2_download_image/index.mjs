import 'node-fetch'
import AWS from 'aws-sdk'

export const handler = async(event) => {
    const s3 = new AWS.S3({ region: 'eu-central-1' });

    const eventType = event.Records[0].eventName
    if (eventType != "INSERT") {
        console.log("Event type is", eventType, "not INSERT. Exiting...")
        return
    }

    let url = ''
    try {
        url = event.Records[0].dynamodb.NewImage.url.S
    } catch (error) {
        console.log(error)
        return
    }
    
    let result = await fetch(url);
    if (!result.ok) {
        throw Error(result.statusText);
    }

    const filename = event.Records[0].dynamodb.Keys.filename.S
    console.log("FILENAME:", filename)

    let blob = await result.blob();
    let arrayBuffer = await blob.arrayBuffer();
    let buf = Buffer.from(arrayBuffer)

    let params = {
        Body: buf,
        Key: filename,
        Bucket: "skinute-slike"
    }

    return await s3.putObject(params).promise();
};