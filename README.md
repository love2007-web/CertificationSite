# Certify

Certify helps you generate certificates from a set of templates just by creating excel sheet of participants

<p align="center">
<a href="https://blaze-certify.netlify.app">
<img src="https://certify-hax.s3.ap-south-1.amazonaws.com/certify.png" width="400px" height="100px" alt="Lyricist Logo"/>
</a>
</p>


## Project Description
Generating certificates can be long and tedious task, to send out even, more, while building out certify I kept this very thing in mind, whenever an admin adds people names to the certificate generator, my uniquely trained model takes the input via .csv file, checks if the user exists in the database, If yes, adds the certificate to their profile, if not it creates an account for him/her with the permission of the admin, stores the certificate and sends out a mail notifying the users whose certificates are generated.

This ensures that all of your certificates are available in one place. And it makes it easier for both the person generating the certificates, and the person receiving the certificates.

To achieve this, I use certificate templates, in which the information provided in the CSV file is placed into corresponding areas. All of the data is stored and accessed using AWS. The frontend communicates only with the backend, which in turn communicates with AWS and all the other services.


## Inspiration
There are multiple events going on both online and offline in recent times, the hassle of generating certificates for all participants has always been there, so in order to solve the problem, I thought to create a mobile application as well as a website to overcome the problem

## What it does
Certify basically takes in your data in a .csv format and converts it and adds it to the certificate template which you chose.

## How I built it
I created Certify basically using ReactJs and NodeJs as they work fantastic in harmony with each other.

## Challenges I ran into
To generate a QR Code in order to verify the authenticity of the certificate and actually put it on the certificate was a bit of a hassle as the loading time was going pretty high, I am currently trying to minimise the loading times, for some reason the hosted app kept crashing but was working fine onn local.

## Accomplishments that we're proud of.
I created this application in basically 1.5 Months and hosted it using AWS and custom domains and to see it work in harmony is such a great sight altogether

## What we learned
Design, I never thought designing a certificate would be this hard xD

## Steps to run the Server
```bash
$ git clone https://github.com/love2007-web/CertificationSite.git
$ cd Certify-VIT-Hack
$ npm i
$ add the .env file in root of the project
$ npm run dev/npm start
$ .env config
- dbURI
- jwtSecret
- SendgridAPIKey
- sendgridEmail
- AdminSignupCode
- AWS_KEY_ID
- AWS_SECRET_ACCESS
- AWS_DEFAULT_REGION
- AWS_S3_BUCKET
```
## Steps to run the Frontend

``` bash
Frontend:
$ cd into Frontend folder
$ run "npm install"
$ Make a .env file in the Frontend folder, add a field "REACT_APP_BACKEND_URL" with the backend url
$ run "npm start"
```

## Useful Links
- [Certify Website](https://blaze-certify.netlify.app)

## Requirements
-  [x] NodeJs (or https://nodejs.org/en/)
-  [x] Npm
-  [x] AWS Account
-  [x] Internet :P 


```javascript

if (youEnjoyed) {
    starOurRepository();
}

```
