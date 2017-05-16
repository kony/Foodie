# Foodie

**Description**

The app contains metrics for the below things:
Foodie is a restaurant app have following cases

Has google and Facebook logins,

Finding the nearby restaurants,

Adding them to favorites,

The user will be able to see the menu provided by the restaurant,

It also searches the restaurants in a particular city with available cuisines,

Below are the scenarios for which the metrics is defined:

1.Metrics for list of users logged in with a particular google account.

  *To view reports for this there is a custom metrics as defined as "logged in”, user can just drag and drop      the key from right side of the console to the Rows field of the report and to count which user logged in       how many number of times, user   have to create measure, here there is a measure created as   "countLoggedIn" we need to add that in the columns field from the Measures tab present at right side of the   console. The resultant report will be generated.
  
2.Frequently viewed restaurant.
   *Similarly as above user have to add "selected restaurant" metric key to row fields and the respective            count in the columns field.
   
3.No. of times user edited his profile
   *The "edit profile" key can be used and "count
   
4.Restaurants added to favorites list by the user
   *The key for this metrics is "marked as favorite"
   
5.Restaurant searched in a particular city
  *Custom metrics key for this is " 
  
6.How many of users visited order form
   *Key for this metrics is "order food".
   
7.No. of users done payment
   *Key for this metrics is "payment".
   
8.No of users subscribed for push.
   *Key for this metrics is "subscribed for push".
   
9.No. of users entered map form for location: *Key for this metrics is "map1".

**To Run This App for Kony Visualizer Enterprise:**

1. Download the project zip file.
2. Import the visualizer application to visualizer version 7.3
3. Import the MobileFabric appliaction the mobilefabric and publish it.
4. Configure the callback url of the identity service to the corresponding OAuth provider
5. Connect the visualizer appliaction to the mobilefabric app.
6. Build & run the app for supported platforms.

# Supported platforms for Kony Visualizer 7.3
**Mobile**
 * Android
