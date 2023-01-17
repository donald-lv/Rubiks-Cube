CREATE DATABASE rubikscube;

CREATE TABLE IF NOT EXISTS time_submissions(
    id SERIAL PRIMARY KEY,

    user_name TEXT NOT NULL,
    
    start_time TIMESTAMP(4) NOT NULL,
    
    end_time TIMESTAMP(4) NOT NULL,
    
    submission_time TIMESTAMP(0) NOT NULL DEFAULT NOW(),

    CHECK (end_time > start_time)
);
