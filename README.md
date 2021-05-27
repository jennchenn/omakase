# omakase
omakase is a calendar event scheduler. Users connect to the app using their google account, and grant access to omakase to query their calendar. The app then schedules a meeting for a desired length in the next available slot for the user.

### Features
* Connect to Google account
* Retrieve all events in their calendars
* Create a group
* Add existing users to group
* Create a new event (for themselves/with their group members)
* Unit testing for logic and some integrated testing

### Architecture Decisions
* MongoDB: NoSQL database
  * highly flexible allowing for extensions of existing document structures
  * easy to query with NodeJS backend
* NodeJS:
  * library that allows for integration with Google auth/calendar
  * lightweight to allow for easier scaling in the future
* React:
  * simple, allows for easier development

### Endpoints
`/user/register`
* POST: register user with omakase, save user info provided by Google auth flow

`/user/groups`
* GET: retrieve all groups user is currently a member of

`/calendar/list`
* GET: list all of the users' calendars that are connected to their Google account

`/calendar/meeting`
* POST: create a new meeting for the user
* payload:
```
{
    title: string,
    description: string,
    lengthMinutes: int
}
```
`/calendar/groupMeeting`
* POST: create a new meeting for the user
* payload:
```
{
    id: group_id,
    meeting: {
        title: string,
        description: string,
        lengthMinutes: int
    }
}
```

`/group/:id`
* GET: retrieve information about a specific group

`/group`
* POST: create a new group for the user
* payload:
```
{
    name: string
    description: string
}
```

`/group/newMember`
* POST: add a new user to an existing group
* payload:
```
{
    id: string,
    email: string
}
```
### Proposed New Features
* Integrate with different calendars
* Allow users to reschedule events made through omakase
* Allow users to create a shared calendar and track it within the app
* Allow users to invite people who are not yet users to register and join a group

### Development Improvements
* Better error handling and logging throughout app to allow for monitoring
* Implementing session store to keep track of users that are logged in
* Moving Google Auth flow to be handled by backend and not frontend for security
* Encrypting id_token and refresh_tokens
* Refactoring endpoints to provide more flexibility to the user
* Adding full integration test suite

### Bottlenecks
* There is currently a two way relationship between User and Group: this causes double the writes when adding, updating, and removing a user/group
  * In the case one write operation fails, the data would be in a middle state where the User would reference a non-existent Group or vice versa
  * Can instead try to embed group object within user
* Calendar API is queried on every request
  * Store a list of calendars the user has (if they would like to add a new calendar, they can manually request to query and add that calendar to be considered)
* Caching of group data
   * Likely won't be changing often; can be cached and then if updated, retrieve updates and display

### Scaling
* Implementing a load balancer to balance requests
  * Requests can be split up between group requests and calendar requests
  * Alternative requests can be split between 
* Implementing Primary, Secondary database replication
  * Primary would handle writes; Secondary would handle read