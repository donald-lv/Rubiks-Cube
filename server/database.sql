CREATE DATABASE rubiks_cube;

CREATE TABLE time_submissions(
    id SERIAL PRIMARY KEY,
    submission_time TIMESTAMP(2) DEFAULT NOW(),
    start_date TIMESTAMP(4),
    end_date TIMESTAMP(4)
);
