const authentication = {
  type: 'custom',
  test: async function (z, bundle) {
    const { client_secret, client_id, business } = bundle.authData;

    console.log(bundle.authData)

    const authRequest = await z.request({
      "url": "https://api.plutio.com/v1/oauth/token",
      "method": "POST",
      "body": {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "client_credentials"
      },
      "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
        "Business": business,
      }
    });

    const response = JSON.parse(authRequest.content)

    if (response.accessToken) {
      return response;
    } else {
      throw new Error(authRequest.content)
    }
  },
  fields: [
    {
      key: 'business',
      label: 'Business',
      type: 'string',
      required: true,
    },
    {
      key: 'client_id',
      label: 'Client ID',
      type: 'string',
      required: true,
    },
    {
      key: 'client_secret',
      label: 'Client Secret',
      type: 'string',
      required: true,
    }
  ],
  connectionLabel: 'Plutio: {{bundle.authData.business}}'
};

module.exports = authentication;