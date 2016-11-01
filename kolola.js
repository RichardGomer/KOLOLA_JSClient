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



/**
 * Instantiate a KOLOLA object with an API endpoint
 * eg http://www.wsdtc.deimpact.org.uk/api/1/ 
 *
 * and an access token, generated via the admin tools
 * eg abcd-1234-abcd-5678
 */
function KOLOLA(endpoint, token)
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
        
        self.client.request({'q': q, 'token': token}, cb);
    }
    
    self.getEvent = function(id, cb)
    {
        self.client.request({'event': id, 'token': token}, cb);   
    }
    
    /**
     * Get a description of the assessment framework (statements + indicators)
     */
    self.getFramework = function(cb)
    {
        self.client.request({'features':null, 'token': token}, cb);
    }
    
    /**
     * Get information about a person (by PersonID), or persons (array of PersonIDs)
     */
    self.getPerson = function(id, cb)
    {
        self.client.request({'person': id, 'token': token}, cb);   
    }
}



function QuickAPIClient(endpoint)
{
    var self = this;
    
    self.username = false;
    self.password = false;
    
    // Set the username/password for HTTP Authentication
    self.setAuth = function(username, password)
    {
        self.username = username;
        self.password = password;
    }
    
    /**
    * Make a request to the API
    *
    * cb_success: function(data, status, jqXHR) callback if opreation succeeds
    * cb_error (optional): function(Data, status, jqXHR) callback if API returns an error
    * cb_fail (optional, as above): Callback if something goes wrong with the request
    */
    self.request = function(args, cb_success, cb_fail, cb_error)
    {
        if(typeof cb_error == 'undefined')
            cb_error = self.cb_error;
        
        if(typeof cb_fail == 'undefined')
            cb_fail = self.cb_fail;
        
        // Parse the JSON from the API and determine if the operation was successful
        var cb = function(data, status, xhr){
            if(typeof data.success == 'undefined')
            {
                cb_error(data, status, xhr);
            }
            else if(data.success)
            {
                cb_success(data, status, xhr);
            }
            else
            {
                cb_fail(data, status, xhr);
            }
        };
        
        if(self.username !== false && self.password !== false)
        {
            args.user = self.username;
            args.pass = self.password;
        }
        
        var r = $.post(endpoint, args, cb, 'json');
        r.error(cb_error);
    }
    
    
    /**
     * Default callbacks for errors / failures
     */
    // The other end "successfully" reported a problem with the request
    self.cb_fail = function(result)
    {
        alert('RPC was unsuccessful ' + result.message);
    }
    
    // Unexpected errors
    self.cb_error = function(status)
    {
        alert('Error during RPC (' + status + ')');
    }
}

