import AWS from 'aws-sdk'

export const handler = (event) => {
    let data = event.Records[0].messageAttributes
    let body = ""
    body += "Title: " + data.title.stringValue + "\n"
    body += "URL: " + data.url.stringValue + "\n"
    body += "Date: " + data.date.stringValue + "\n"
    body += "Filename: " + data.filename.stringValue + "\n"
    body += "Internal URL: " + data.internal_url.stringValue + "\n"
    body += "Explanation: " + data.explanation.stringValue + "\n"
    console.log(data)

    let ses = new AWS.SES({region: 'eu-central-1'})

    var params = {
    Destination: { 
        ToAddresses: [
            'vojislavlazic00@gmail.com',
            'sara.djurdjevic3z@gmail.com'
        ]
    },
    Message: {
        Body: {
        Text: {
            Charset: "UTF-8",
            Data: body
        }
        },
        Subject: {
            Charset: 'UTF-8',
            Data: "New image added - " + data.title.stringValue
        }
        },
    Source: 'voja@tfwno.gf'
    };

    let sendMailPromise = ses.sendEmail(params).promise();
    sendMailPromise.then(
    function(data) {
        console.log(data.MessageId);
    }).catch(
        function(err) {
        console.error(err, err.stack);
    });
};