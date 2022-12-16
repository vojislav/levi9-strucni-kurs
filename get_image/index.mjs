import AWS from 'aws-sdk'
import 'node-fetch'

export const handler = async(event) => {
    const client = new AWS.DynamoDB({ region: "eu-central-1" });

    const API_KEY = "U0wmYbZi59wgDkBeiE8vZiNZER3rl1bEZMvDFfRe"
    const url = "https://api.nasa.gov/planetary/apod?api_key=" + API_KEY

    let response = await fetch(url)
    let data = await response.json()

    if (data.media_type != "image") {
        console.log("Not an image. Exiting.")
        return
    }

    const filename = data.url.split('/').pop()

    // if field undefined, use blank string
    var params = {
        Item: {
            "url": {
            S: data.url || ""
            }, 
            "title": {
            S: data.title || ""
            }, 
            "explanation": {
            S: data.explanation || ""
            },
            "date": {
            S: data.date || ""
            },
            "filename": {
            S: filename
            },
            "copyright": {
            S: data.copyright || ""
            }
        }, 
        ReturnConsumedCapacity: "TOTAL", 
        TableName: "NASA_slike"
    };

    let putItemResponse = await client.putItem(params).promise()
    console.log(putItemResponse);
};