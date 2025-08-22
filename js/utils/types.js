// js/types.js
/**
 * @typedef {Object} HabitDefinition
 * @property {string} id  - Unique identifier (e.g., 'habitDefinition-0001')
 * @property {string} name - Display name of the habit
 * @property {string} goalType - Either 'daily' or 'cumulative'
 * @property {string} measurement - Unit of measurement (cumulative only)
 * @property {number} goalAmount - Target amount (cumulative only)
 * @property {number} incrementAmount - Increment size (cumulative only)
 * @property {boolean} isActive - Whether habit is currently active
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */


/**
 * @typedef {Object} KeyDate
 * @property {string} id - Unique identifier
 * @property {string} date - Date in YYYY-MM-DD format
 * @property {string} description - Event description
 * @property {string} createdAt - ISO timestamp
 */


/**
 * @typedef {Object} UserSettings
 * @property {string} name - User's display name
 * @property {string} city - User's city for weather
 * @property {Object} preferences - User preferences object
 * @property {string} createdAt - ISO timestamp
 * @property {string} lastUpdated - ISO timestamp
 */

