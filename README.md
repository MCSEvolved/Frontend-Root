# frontend-root

## How to deploy

To build the site and deploy it to the dev enviroment activate the github action.
This can be done by sending an HTTP POST request to the following url.

`https://api.github.com/repos/MCSEvolved/frontend-root/dispatches`

The request will need a body that looks like this:

```JSON
{
    "event_type": "rootbuild"
}
```

And the request will need an authorization header with a bearer token.
The token can be obtained here `https://github.com/settings/tokens`.

You can activate the action manually by sending the request with either postman or curl, or create an action for a page so that whenever you update your page it will automaticly update the dev enviroment too.

You can find an example workflow yaml in the root of this repo. Copy it to .github/workflows/rootbuild.yaml in your repo to use it.
