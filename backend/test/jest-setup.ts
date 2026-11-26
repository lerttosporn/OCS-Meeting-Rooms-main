// This file runs before each test suite to ensure the app uses the test DB
process.env.DB_URL = 'postgresql://admin:mysecretpassword@localhost:5432/OCS_meeting_test';
