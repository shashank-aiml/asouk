const sibApiV3Sdk = require('sib-api-v3-sdk');

const SendMail = ({url}) => {
    var defaultClient = sibApiV3Sdk.ApiClient.instance;
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.SENDINBLUEAPI;
    var apiInstance = new sibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.sendTransacEmail({

        'sender': { 'email': 'info@ginkgos.online', 'name': 'Ginkgos' },
        'to': [{ name: 'name', 'email': 'pulkit0729@gmail.com' }],
        'replyTo': { 'email': 'thesupport@ginkgos.online' },
        'headers': {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
        },
        'subject':'verification',
        'textContent':`${url}`

    }).then(function (data) {
        console.log(data);
    }, function (error) {
        console.error(error);
    });
};

module.exports = SendMail;


