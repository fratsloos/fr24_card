# Installation

It is recommended to use HACS to install this card. If you want to install the card manually, follow the next steps:

1. [Download](https://github.com/fratsloos/fr24_card/archive/refs/heads/master.zip) the master branch source as ZIP;
2. Extract the ZIP on yout local computer;
3. Copy the contents of the dist folder to your Home Assistant installation. Copy the files to the `config/www/fr24card/` folder;
   - Copy all files, including the images folder!
4. Add the card to your Dashboard resources:
   1. Your Home Assistant user needs `Advaced Mode`, you can find this in your user profile;
   2. Go to `Settings` > `Dashboards`;
   3. On the top right side, click the menu icon (three dots), and select 'Resources';
   4. Click on the button 'ADD RESOURCE';
   5. The URL for the resource is `/local/fr24card/fr24_card.js`;
   6. Select 'Javascript Module';
   7. Click 'CREATE'.
5. Home Assistant is known for the aggresive caching, so make sure to reload the cache of your browser.
