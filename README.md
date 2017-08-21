# Elevate-O-Meter

GPX recording apps like [Locus](http://www.locusmap.eu/) are great for hikers.
They use GPS receivers in a phone to locate us on a good vector map downloaded
and stored off-line and even allow to record the hike. After the trip they show
a summary of the recorded track – usually the data like distance, average speed
or elevation gain.

## Estimating the elevation gain

The estimation of the elevation gain is unfortunately often very imprecise.
The GPS receiver can be off by around ten meters to either side and throught the
day the differences coming from this imprecision can add-up to gigantic numbers.
The apps like Locus try to solve the issue by apllying some smoothing to the
altitude profile of the track, which is a generic way to treat data, not really
helpful for this particular task.

A human with a map in hand is usually better at estimating the altitude gain of
a path then the apps. Our trips usually consist of a small number of peaks that
are easy to identify. We can also find the lowest points between these peaks and
sum the altitude differences.

The same thing could also be done by the app, if it only could read the map.
Unfortunately, the map is just a picture, the app does not really _understand_
it. We could however help the app by telling it **how many peaks** there were
in the trip. The app should be able to find these peaks in the track profile.

# Usage

That is essentially what our app is doing. We tell it to find peak after peak
and it should find them. Once the peak is identified, it is shown on the map,
in the new (estimated) profile, and counted in to the elevation gain estimation.

## Step one: Load the track

The track must be in GPX and only contain one path.

## Identifying the peaks

By clicking the `Add peak` button, we invoke a search. The new peak will be
immediately presented on the map.

## Removing wrongly identified peaks

Sometimes we might not agree with a peak that the app thinks it found in the
track profile. By clicking in the marker and `Delete` button, we can remove the
peak.

## Limiting the peak search range

If the app is not able to find the peak, that we can see ourselves, the sliders
allow us to limit the part of the track where the search should be performed.