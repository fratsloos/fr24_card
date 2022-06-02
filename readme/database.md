# Database

The project contains a database with the registration codes of aircrafts based on the hex code (ICAO code). The database is a large JSON object that is added to the `window` object of the browser. Its content is generated based on the JSON files that are distributed in the `/public_html/db/` folder of Dump1090. In this case the version from [FlightAware](https://github.com/flightaware/dump1090) is used.

You can generate the database with the a script added to this repository. It's also possible to add entries to the database that are not in the JSON files of Dump1090.

## Generate the database

Follow these steps to generate the database:

1. Checkout a repository which contains Dump1090, including the JSON files in the `/public_html/db/` folder. For example use [flightaware/dump1090](https://github.com/flightaware/dump1090);
2. Copy `.env.example` in this repository to `.env` and update the location of `DUMP1090_FOLDER` to the location on your computer where you checked out the repositry in step 1;
3. Use Node to install the requirements in this repository: `npm install`;
4. When the modules are downloaded, you can generate the database with the following command: `npm run database`.

## Adding custom entries

Custom entries can be added by adding them to the the JSON object in [`registrations.json`](../build/data/registrations.json). If you want to share your entries, please do so using a pull request to our `develop` branch.
