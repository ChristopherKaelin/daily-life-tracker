# The Daily Life Tracker

## Overview

A digital habit and goal tracker with calendar management that combines productivity tracking with personal organization in a clean, intuitive web application. The Daily Life Tracker helps users build consistent habits, track progress toward goals, and stay organized with key date management—all while providing daily motivation through weather updates and inspirational quotes.

## Description

The Daily Life Tracker is a responsive web application that helps users build consistent habits and stay organized through an intuitive dashboard. Built with vanilla HTML, CSS, and JavaScript, the app combines habit tracking, goal management, and calendar organization into one streamlined interface. Users can create custom habit definitions with different goal types—daily completion habits (like "read for 30 minutes") or cumulative goals (like "walk 30 miles this month in 0.5-mile increments"). The app features a visual calendar for tracking key dates and events, real-time weather updates for user-selected U.S. cities via the WeatherAPI, and daily inspirational quotes from the Quotable API (with offline fallback quotes). All user data is stored locally using localStorage, ensuring complete privacy while maintaining progress across browser sessions. The application prioritizes mobile-first design and accessibility to provide a seamless experience across all devices.

## Installation Instructions

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/ChristopherKaelin/daily-life-tracker.git
   ```
2. Navigate to the project directory:
   ```
   cd daily-life-tracker
   ```
3. Create the configuration file for API access:

- Create a file named config.js in the root directory
- Add the WeatherAPI key with this format:
  ```javascript
  const CONFIG = {
    WeatherAPI_KEY: "your_api_key_here",
  };
  ```

4. Open `index.html` in your preferred web browser or use a local development server like Live Server in VS Code
5. No additional dependencies or build processes required - it's pure HTML, CSS, and JavaScript!

**Note for Reviewers:** The weather functionality requires a valid API key. The app will gracefully handle missing API configurations and still function for habit tracking and calendar features.

## Usage

1. **First Time Setup**: Enter your name and select your city for personalized experience
2. **Create Habit Definitions**: Define custom habits with different goal types (daily completion or cumulative targets with specific measurements)
3. **Manage Monthly Goals:** Select which habits you want to track each month from your available habit definitions
4. **Daily Progress Tracking**: Mark off completed habits or increment progress on cumulative goals using the interface
5. **Calendar Management**: Add key dates and events to the monthly calendar view.
6. **Weather & Quotes**: Start each day with current weather and inspirational quotes

## Examples

- **Daily Habits**: Mark completion of activities like reading, exercise, or meditation
- **Cumulative Goals**: Build toward monthly targets like "write 50 pages" or "walk 30 miles"
- **Daily Progress**: Simple yes/no tracking for completing 30 minutes of reading each day
- **Cumulative Progress**: Track each 0.5 mile walked toward a monthly goal of 30 miles
- **Monthly Planning**: Use the calendar to add key dates and track habit consistency over time

## Project Roadmap

### Version 1.0 (Current - Habit Tracking & Calendar)

- ✅ User Settings & Basic Setup
- ✅ Calendar Display with Key Dates
- ✅ Habit Definition Management
- ✅ Monthly Goal Selection
- ✅ Daily Progress Tracking
- ✅ Weather Integration
- ✅ Quote Integration

### Version 2.0 (Planned - Journaling & Personalization)

- ⏳ Daily Journaling System
- ⏳ Quote Favorites and Customization
- ⏳ Task Tracker integration
- ⏳ Advanced customization options
- ⏳ Cloud data storage

### Version 3.0 (Future - Analytics & Enhancement)

- 📋 Journal Entry Search
- 📋 Integration with Calendar Events
- 📋 Habit Streak Tracking
- 📋 Goal Achievement Badges
- 📋 Customizable Themes

## License

This project is licensed under the MIT License.

## Credits

- **Weather Data**: Powered by WeatherAPI
- **Daily Quotes**: Provided by Quotable API
- **Icons**: Custom SVG icons from SVG Repo
- **Inspiration**: My personal paper-based habit tracking and goal journaling system

## AI Usage

AI played a supportive role throughout the development of this project in several ways:

- Assisted in creating milestones and issues for project planning on GitHub
- Generated the `<option>` HTML tags for the city/state dropdown list
- Helped fine-tune the color palette for a more cohesive design
- Provided guidance on organizing the folder and file structure for maintainability
- Aided in debugging by helping troubleshoot and resolve issues during development
