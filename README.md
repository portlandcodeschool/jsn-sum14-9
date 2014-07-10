# Homework 9: jQuery, Express.js, Orchestrate

### Assignment: 
Using your new-found knowledge, with example apps from the past two weeks as "skeletons", build a new app. Pick content for your app that is reasonably relevant or interesting to you. Instead of a todo app, perhaps you have an app that keeps track of your favorite beverages (many people do wine or beer, but non-alcoholic is cool too). You can bring back the recipe manager if you feel like it. Perhaps a bug taxonomy app with pictures of bugs and fun and interesting facts? These are arbitrary examples. The point is to pick one that is fun for you to work with. 
### Requirements: 
- Seek help when you get stuck. 
- Seek help from your peers, teachers, and TAs regarding ideas for apps. This challenge of coming up with an idea will be good preparation for your group projects. 
- **Use jQuery** at least once to change something on the page. Try to use event listeners. Use any part of jQuery that is interesting or fun to you. 
- Use at least one **orchestrate.io** request, such as: 
```js
  db.put('my-todos', 'todo1', {
    "todo": "mow the lawn"
  })
  .fail(function (err) {
    console.error(err);
    console.error('could not add the todo. sorry :-(');
  });
```
- Use at least a bare-bones **express.js server** to serve your content (html, css, client-side javascript) and to manage how data gets from the database to the server to the client and the reverse. 

### Purpose: 
We now have a much larger set of tools to build applications with. We are using javascript on both the client and the server. This can be overwhelming. There are lots of details. You have all also reached the point where creating things with code is much more valuable to your learning than simply reading a book about code. 

Another aspect of this assignment is application design. This design is determined by the content but it is also affected by which tools we use. In our case, we have to figure out how to make an app while using jQuery, Orchestrate, and Express.js. Learning this design process, with all of its built-in constraints and challenges, will help you learn how to wield javascript in interesting and helpful ways. 

### Recomendations: 
1. **Break things**. You have to write bad code before you can write good code. 
2. Spend your time in code and then look for educational materials or check documentation. 
3. If one of the three ingredients of this assignment (jQuery, express, orchestrate) is difficult for you, do it last. **Start with what you are most comfortable with**, even if that is drawing a picture of the user interface or drawing some diagrams. Practice "pre-coding". This can include pseudo code, or really anything you want.
4. Start with the simplest version of your app possible and get that to work. Then add more interesting features. This will boost your confidence and help you to solve problems and add features more easily. 

