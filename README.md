# DrChrono OAuth Backend

Use this cloud function to get an OAuth token for [DrChrono API](https://app.drchrono.com/api-docs/v2016_06/documentation)

```shell
curl -X POST \
  https://us-central1-dr-chrono.cloudfunctions.net/createToken \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"code":"CODE",
	"grant_type":"authorization_code",
	"redirect_uri":"REDIRECT_URI",
	"client_id":"CLIENT_ID",
	"client_secret":"CLIENT_SECRET"
}
'
```

Created to overcome No 'Access-Control-Allow-Origin' error on direct request
