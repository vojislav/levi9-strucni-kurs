import 'node-fetch'
import AWS from 'aws-sdk'

const s3 = new AWS.S3({ region: 'eu-central-1' });

export const handler = async(event) => {
    const eventType = event.Records[0].eventName
    if (eventType != "INSERT") {
        console.log("Event type is", eventType, "not INSERT. Exiting...")
        return
    }

    let url = ""
    try {
        url = event.Records[0].dynamodb.NewImage.url.S
    } catch (error) {
        console.log(error)
        return
    }
    console.log("Got image url:", url)
    //const url = "https://apod.nasa.gov/apod/image/2212/Mars-Stereo.png"
    //const url = "https://apod.nasa.gov/apod/image/2212/Pleiades_Estes_1080.jpg"
    //const url = "https://apod.nasa.gov/apod/image/2211/LastRingPortrait_Cassini_4472.jpg"
    
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
        Bucket: "nasa-slike"
    }

    return await s3.putObject(params).promise();
};