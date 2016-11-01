# KOLOLA JS Client


The Javascript client library for the KOLOLA API.  It's a pretty simple client (in part because the API itself is still quite simple and read-only).

* TIP: In Firefox, use JSONView to pretty-print raw JSON output from the API! https://addons.mozilla.org/en-US/firefox/addon/jsonview/
* The API is GET/POST based rather than truly RESTFUL, which makes it quite easy to query just by typing URLs into a web browser.

## Requirements

* jQuery

## Instantiation

Generate a new API token using the admin tools in the target instance.

```javascript
var endpoint_url = "http://www.wsdtc.deimpact.org.uk/api/1/"; // For example
var client = new KOLOLA(endpoint_url, "the-generated-api-token");
```

## Querying Events/People

The most powerful feature is the ability to query the event database.  The same search queries that are supported in the KOLOLA web interface are supported by the API.  This is done via the   Examples include:

* "user:rcg1v07" - To get all events that involved a particular user (by username)
* "02/2014" - To get all events in February 2014
* "headley" - To get all events with the word "headley" in the title or description

See https://www.kolola.net/support/user_support/queries.html for more information about using search queries in KOLOLA

Queries are sent like so:
```javascript
var cbevents = function(events){ console.log("Received events", events); };
var cbpeople = function(people){ console.log("Received people", people); };
client.query('headley', ebevents, cbpeople);
```
* See the response: (http://www.wsdtc.deimpact.org.uk/api/1/?q=headley)

Like the KOLOLA web interface, queries return matching events AND people (if any - and only for some types of query).  Events are given to the first callback, people are given to the second callback.

## Getting a particular event (or events)

Events can also be queried by their internal ID.  Use the ```getEvent()``` method to do so
```javascript
client.getEvent([14,53,101], function(events){ console.log("Got events", events) });
```

## Getting a particular person (or people)

Like events, people can be queried by ID.  Again, specify an array of IDs to query for multiple people at the same time.

```javascript
client.getPerson([1,5,6], function(people){ console.log("Got people", people) });
```


## Getting the Framework

KOLOLA's real strength, from an oversight perspective, is the ability to assess how activities contribute towards broader goals.  An impact framework provides a set of indicators and true-or-false statements that are used to assess whether an event contributed to that indicator.

Events come back from the API with information about the statements ("features") that are associated with it.  But those features need to be compared to a framework to see which indicators they map to, and what the statement actually says.

The framework information object can easily be retrieved using the getFramework() method on the client.
```javascript
client.getFramework(function(fw){ console.log("Got the framework!", fw); });
```
* See the response: (http://www.wsdtc.deimpact.org.uk/api/1/?features)

## Photos

The URL of photos are returned by the API for events and people.  People have a 100x100 avatar, and events photos are provided in 3 sizes:
* ```url```: A 900pixel wide version, with original proportions maintained
* ```thumb```: A 100pixel wide/tall version, cropped to fill the square
* ```original```: Whatever was uploaded originally - Potentially very large!
