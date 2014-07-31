/*
 *  KOLOLA Javascript Client - www.kolola.net
 *
    The MIT License (MIT)

    Copyright (c) 2014 KOLOLA Limited

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
 *
 */
 
function QuickAPIClient(endpoint)
{
    var self = this;
    
    self.username = false;
    self.password = false;
    self.endpoint = endpoint;
    
    // Set the username/password for HTTP Authentication
    self.setAuth = function(username, password)
    {
        self.username = username;
        self.password = password;
    }
    
    /**
    * Make a request to the API
    *
    * cb_success: function(data, status, jqXHR) callback if operation succeeds
    * cb_error (optional): function(Data, status, jqXHR) callback if API returns an error
    * cb_fail (optional, as above): Callback if something goes wrong with the request
    */
    self.request = function(args, cb_success, cb_error, cb_fail)
    {
        if(typeof cb_error == 'undefined')
            cb_error = self.default_error;
        
        if(typeof cb_fail == 'undefined')
            cb_fail = self.default_fail;
        
        // Parse the JSON from the API and determine if the operation was successful
        var cb = function(data, status, xhr){
            if(typeof data.success == 'undefined')
            {
                cb_fail(data, status, xhr);
            }
            else if(data.success)
            {
                cb_success(data.result, status, xhr);
            }
            else
            {
                cb_error(data, status, xhr);
            }
        };
        self.endpoint = self.endpoint + "?callback=?";
        var r = $.post(self.endpoint, args, cb, 'json');
        r.error(cb_fail);
    }
    
    
    /**
     * Default callbacks for errors / failures
     */
    self.cb_error = function(result)
    {
        alert('RPC Error: ' + result.message);
    }
    
    self.cb_fail = function(result)
    {
        alert('HTTP RPC Failed D: (' + status + ')');
    }
}

/**
 * Instantiate a KOLOLA object with an API endpoint
 * eg http://www.wsdtc.deimpact.org.uk/api/1/
 */
function KOLOLA(endpoint)
{
    var self = this;
    
    self.client = new QuickAPIClient(endpoint);
    
    /**
     * Query for events/people using the same query syntax as the KOLOLA
     * search box.
     *
     * Events are passed to the first callback, people to the second
     *
     * eg:  "MM/YYYY" : Events by month
     *      "user:jb1b09" : Events by user
     *      "foo" : Events by keyword
     *       
     */
    self.query = function(q, cb_events, cb_people, cb_all)
    {
        if(typeof cb_all === 'undefined')
            cb_all = function(){};
        
        var cb = function(data)
        {
            cb_events(data.events);
            cb_people(data.people);
            cb_all(data);
        }
        
        self.client.request({'q': q}, cb);
    }
    
    self.getEvent = function(id, cb)
    {
        self.client.request({'event': id}, cb);   
    }
    
    /**
     * Get a description of the assessment framework (statements + indicators)
     */
    self.getFramework = function(cb)
    {
        self.client.request({'features':null}, cb);
    }
    
    /**
     * Get information about a person (by PersonID), or persons (array of PersonIDs)
     */
    self.getPerson = function(id, cb)
    {
        self.client.request({'person': id}, cb);   
    }
}



