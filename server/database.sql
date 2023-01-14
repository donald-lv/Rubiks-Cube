CREATE DATABASE rubikscube;

CREATE TABLE IF NOT EXISTS time_submissions(
    id SERIAL PRIMARY KEY,
    submission_time TIMESTAMP(0) NOT NULL DEFAULT NOW(),
    start_time TIMESTAMP(4) NOT NULL,
    end_time TIMESTAMP(4) NOT NULL,
    CHECK (end_time > start_time)
);
