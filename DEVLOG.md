# TripN Development Log

## Project Overview

I chose a travel planner because I wanted to build something I could realistically use myself and continue developing after the bootcamp.

My original ideas included:

- User registration and login
- Trip creation and management
- Daily itinerary planning
- Location search and saved places
- Budget and expense tracking
- Weather information
- Trip sharing
- Interactive maps and additional travel tools

As development progressed, I decided it was more important to finish, test, and deploy the main features properly than to rush every idea into the first version. Features such as trip sharing and more advanced travel tools were left for later development.

---

# Week 1 - Planning and Initial Setup

The first week focused on planning the application and setting up the development environment.

I decided to build TripN with React Native, Expo, Expo Router, and TypeScript. I also planned to use Node.js and Express for the backend, MongoDB for data storage, and external APIs for location and weather information.

One of my first challenges was mobile testing. I originally planned to use Expo Go on my physical phone, but the version of Expo Go available to me was not working properly with the Expo SDK version used by the project.

Instead of continuing to troubleshoot the phone setup, I installed Android Studio and configured an Android emulator. This gave me a reliable mobile environment that I continued using throughout development.

I also spent time cleaning the Expo starter project and organizing TripN into folders for screens, reusable components, services, constants, authentication, and utilities.

The first screens I created were:

- Welcome
- Register
- Login

I also created reusable inputs and buttons so the design would stay consistent as the project grew.

### Week 1 Challenges and Learnings

The main challenge was getting a dependable mobile development environment running.

Setting up the Android emulator took extra time, but it ultimately made testing much easier. I learned that sometimes changing the development approach is more practical than spending too much time trying to repair one particular setup.

By the end of Week 1, TripN had its basic design, project structure, navigation, authentication screens, and working Android/web development environments.

---

# Week 2 - Backend and Core Trip Planning

The second week focused on turning TripN into a full-stack application.

I created the Express backend, connected it to MongoDB Atlas, and added registration and login.

Authentication included password hashing, JWT tokens, persistent sessions, logout, and protected areas of the application.

After authentication was working, I moved on to the main TripN functionality.

I created full trip management so users could:

- Create trips
- View their trips
- Edit trip information
- Delete trips

Each trip was connected to the authenticated user.

I then built the itinerary system. Users could add activities with a date, time, location, and notes. Activities could also be edited and removed.

### Week 2 Challenges and Learnings

Several problems appeared as the application became more complex.

Expo Router produced navigation and route-group warnings that required changes to the route layouts. TypeScript also caught problems with dynamic trip routes and backend route parameters.

Another issue appeared when itinerary dates were correct on Android but displayed one day earlier on web. I changed how calendar dates were formatted so the intended day remained consistent between platforms.

These problems helped me become more comfortable reading error messages and solving issues one piece at a time instead of immediately changing large sections of code.

By the end of Week 2, TripN had working authentication, protected routes, trip management, and itinerary planning on both Android and web.

---

# Week 3 - Features, Testing, and Deployment

The final week focused on completing the remaining core features and preparing TripN for submission.

I added budget and expense tracking. Users could set a planned trip budget, record expenses, and see how much money had been spent and how much remained.

I then integrated Geoapify into the Explore screen so users could search for locations. I expanded this by allowing selected places to be saved to the user's account and removed later.

OpenWeather was added next. TripN uses the coordinates from a selected Geoapify result to retrieve current weather information for that location.

At this stage, the main TripN feature set was complete:

- Authentication
- Trip management
- Itinerary planning
- Budget tracking
- Location search
- Saved places
- Weather information

### Final Challenges

The Explore screen required additional work after several features were added to it. I needed to correct scrolling and make sure old weather/search information was cleared when users searched for a new location.

Deployment also introduced new problems that were not visible during local development. The first backend deployment could not connect to MongoDB Atlas because the database network settings did not yet allow the deployed server. After updating the Atlas network access settings, the deployment succeeded.

I also found a navigation problem when refreshing an individual Trip Details page in the deployed web application. I changed the Back behavior so it returns directly to My Trips instead of relying on navigation history.

These final issues showed me why testing a deployed application is just as important as testing locally.

---

# Testing and Final Review

TripN was tested throughout development rather than only at the end.

I regularly tested on:

- Android emulator
- Desktop browser
- Mobile browser
- Deployed web application

I tested complete workflows including registration, login, trip management, itinerary activities, expenses, saved places, weather, logout, session persistence, and cross-platform date behavior.

---

# Final Reflection

TripN changed considerably from the original idea, but the main purpose of the application remained the same: providing one place where users could organize important parts of a trip.

One of the most important lessons from the project was learning how to manage scope.

I originally wanted to include more features, especially trip sharing and additional travel tools. As the deadline approached, I decided that finishing and testing the existing features was more valuable than adding features that might not be reliable.

That decision gave me time to test TripN across Android and web, fix problems discovered during deployment, improve the project structure, document the application, and deploy a working version.

The project also gave me practical experience connecting the different parts of a full-stack application.

Overall, TripN helped me become more confident working with React Native, Expo, TypeScript, Express, MongoDB, APIs, Git/GitHub, mobile emulators, debugging, and deployment.

The finished application provides a solid foundation that I can continue improving beyond the capstone.