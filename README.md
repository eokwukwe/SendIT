[![Build Status](https://travis-ci.org/eokwukwe/sendIT.svg?branch=develop)](https://travis-ci.org/eokwukwe/sendIT) [![Coverage Status](https://coveralls.io/repos/github/eokwukwe/sendIT/badge.svg?branch=develop)](https://coveralls.io/github/eokwukwe/sendIT?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/5a04d6642dc7f1a8018e/maintainability)](https://codeclimate.com/github/eokwukwe/sendIT/maintainability)

# Introduction
SendIT is a courier service that helps users deliver parcels to different destinations. SendIT provides courier quotes based on weight categories.

Github homepage [SendIT](https://eokwukwe.github.io/sendIT/UI/)

## Table of Content
 -  features of the application
 -  technology stack used
 -  getting started
 -  running tests
 - api endpoints


## Features of the application
1. Users can create an account and log in.
2. Users can create a parcel delivery order.
3. Users can change the destination of a parcel delivery order.
4. Users can cancel a parcel delivery order.
5. Users can see the details of a delivery order.
6. Admin can change the status and present location of a parcel delivery order.

## Technology Stack Used
- HTML
- CSS
- Javascript
- NodeJS
- PostgreSQL

## Getting Started
1. Clone the repository
2. cd into the directory
3. Run `npm install` 
4. Run `npm run start` to start the server at `localhost:3001`

## Running Test
Run `npm run test` to run test

## API Endpoints

| Endpoints | Functionality | Note |
| ------ | ------ | ------ |
| GET /parcels | Fetch all parcel delivery orders |
| GET /parcels/:parcelId | Fetch a specific parcel delivery order |
| GET /users/:userId/parcels | Fetch all parcel delivery orders by a specific user |
| PUT /parcels/:parcelId/cancel | Cancel the specific parcel delivery order |
| POST /parcels | Create a parcel delivery order |
| POST /auth/signup | Register a user |
| POST /auth/login | Login a user |
| PUT /parcels/:parcelId/destination | Change the location of a specific parcel delivery order | Only the user who created the parcel delivery order can change the destination of the parcel |
| PUT /parcels/:parcelId/status | Change the status of a specific parcel delivery order | Only the Admin can change the status of a specific parcel delivery order |
| PUT /parcels/:parcelId/presentLocation | Change the present location of a specific parcel delivery order | Only the Admin can change the present location of a specific parcel delivery order |



## Links
Project Management: https://www.pivotaltracker.com/n/projects/2213004

Heroku app: https://fcode-send-it.herokuapp.com

## Author
Okwukwe Ewurum
