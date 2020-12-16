# Nodemailer Skeleton

## Setup
* Check your email provider for info about setting up third-party access to smtp host
* Copy config.sample.js and update with your settings

## Run server
`yarn && yarn start`

## Usage
Send `POST` request to `1.2.3.4:3002:/send`

Body should be of form:

```
{
	"name": "Test",
	"email": "fromEmail@email.com",
	"to": "toEmail@email.com",
	"title": "Testing contact form endpoint",
	"message": "Message body goes here."
}
```
