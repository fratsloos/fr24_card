# F.A.Q.

Okay, I admit it: these are not frequently asked questions (yet), but to get ahead of them, here are a few questions that I think will come up.

## That table is nice and all, but can you also make a map?

This card does not support map. Maybe that will change in the future, but I'm not making any promises about this. The map card in Home Assistant works on the basis of sensors, and since this is not an integration but a Javascript module, sensors are only read, not created.

## Why does the card take up a lot of space? Or, why is there only one card in the column?

The contents of the card may change each time the sensor is refreshed. After all, the number of aircraft displayed is not always the same.

To ensure that your dashboard does not jump every time the sensor is renewed, I have chosen to give the card a static height, and to make it so high that it is almost certain that no card will be placed underneath.

## The popup doesn't work?

The popup is based on the functionalities of [browser_mod](https://github.com/thomasloven/hass-browser_mod). Install browser_mod and try again.

## The format of the popup looks strange?

The popup format is added using [card-mod](https://github.com/thomasloven/lovelace-card-mod). Install card mod and try again.

## If I have the popup open and the sensor is refreshed, does the data in the popup not change?

This is a choice made when developing the card. This choice could just be different in a next version. For now, this setup is sufficient.

The data in the popup is static because the data is sent to the markdown card as a static object when the popup is opened.

This has the added benefit that when the popup is open and the plane gets out of sight of your system, the popup won't run out of data.

## The distance is not correct

The distance is calculated between the coordinates of your configured zone and the position that is received from the aircraft. If you believe the distance is not correct, check if the coordinates of your zone are correct.
