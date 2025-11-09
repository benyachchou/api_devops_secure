require('dotenv').config();

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const RATE_LIMIT_WINDOW_MS = Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100;
const LOGIN_RATE_LIMIT_WINDOW_MS = Number.parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000; // 15 minutes
const LOGIN_RATE_LIMIT_MAX = Number.parseInt(process.env.LOGIN_RATE_LIMIT_MAX, 10) || 50; // Par défaut plus restrictif

module.exports = {
  CORS_ORIGIN,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  LOGIN_RATE_LIMIT_WINDOW_MS,
  LOGIN_RATE_LIMIT_MAX
};

