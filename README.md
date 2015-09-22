# STI Testing locations
A node.js version of the STI SMS location finder app

## Installation

once repository is cloned to your local machine, install the application dependencies:

    $ npm install

Create a `.env` file in the root directory of the project and add the following:

    TW_ACCOUNT_SID=
    TW_AUTH_TOKEN=
    TEST_PHONE=

where `TW_ACCOUNT_SID` and `TW_AUTH_TOKEN` are Twilio keys that you can get from [adam (adam@codeforrva.org)]('mailto:adam@codeforrva.org'), and `TEST_PHONE` is the phone number to where test text should be sent.  It is important to enter the phone number as such `+18045555555`, that is with a `+1` and then the phone number with area code with no hypen.

Start the express server:

    $ node app.js

SMS service does not work locally since a network-reachable url is needed by Twilio.  However, you can simulate responses using a `GET` request with query string parameter `zip`. An example request:

    http://localhost:300?zip=23220


## Contributing

We utilize pull requests to incorporate changes to the code base. If you are a regular contributor, we can add you to the project's maintainers team in order to get direct `push` access rights.
