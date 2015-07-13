# STI Testing locations
A node.js version of the STI SMS location finder app

## Installation

once repository is cloned to your local machine, install the application dependencies:

    $ npm install

Start the express server:

    $ node app.js

SMS service does not work locally since a network-reachable url is needed by Twilio.  However, you can simulate responses using a `GET` request with query string parameter `zip`. An example request:

    http://localhost:300?zip=23220


## Contributing

We utilize pull requests to incorporate changes to the code base. If you are a regular contributor, we can add you to the project's maintainers team in order to get direct `push` access rights.
