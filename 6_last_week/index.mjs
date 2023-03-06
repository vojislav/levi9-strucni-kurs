import AWS from 'aws-sdk'

export const handler = async(event) => {
    const dynamodb = new AWS.DynamoDB({region: 'eu-central-1'})

    var params = {
        TableName: "slike"
    };

    let data = await dynamodb.scan(params).promise();

    data.Items.sort(function(a, b){
        a = a.date.S;
        b = b.date.S;
        return b.localeCompare(a);
    });

    const response = {
        statusCode: 200,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data.Items.slice(0,7))
    };

    console.log("response: " + JSON.stringify(response))
    return response;
};