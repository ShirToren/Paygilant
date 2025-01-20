## Steps to run the application locally

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Explanation

My app is showing the posts data in JSONPlaceholder API.

I used the local storage to manage a cache -
The data in the API does not change often, so I decided to manage a cache to save the data instead of fetching it from the API many times.
Since I don't have access to the DB, and no way to know when it is updated, I chose to update the cache once an hour.

The posts list is inside the PostContext.js file, which is used as a Provider for all the components in the app. It manages the data in the app, it includes the API calls, and most of the logic.

In the posts page you can see all the posts in a card format. When clicking on the "View Details" button it will nevigate to this post's details page and fetch its comments.

With the search bar you can search a post by title, and with the "Add new post" button you can add a new post, while title and content are both mandatory fields.

By clicking on the "Add Post" button, the PostsContext will send a POST request to the API with the new post object. JSONPlaceholder accepts POST requests but does not reflect them when fetching posts again (Doesn't really posts the data into the database). So in order to display the new post in the app, I saved it directly in my posts list, and also in the cache (in the local storage). In fact, after an hour, when the cache will be updated, the new post will be deleted.
