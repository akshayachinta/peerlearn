-- =========================================================
-- PEERLEARN - COMPLETE MYSQL DATABASE SCHEMA (ALL 10 ENTITIES)
-- Database: peerlearn_db
-- =========================================================

CREATE DATABASE IF NOT EXISTS peerlearn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE peerlearn_db;

-- 1. Students Entity Table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    college_name VARCHAR(200) NOT NULL,
    branch VARCHAR(120) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    profile_photo VARCHAR(255),
    bio TEXT,
    availability VARCHAR(50) DEFAULT 'Available',
    rating DOUBLE DEFAULT 5.0,
    review_count INT DEFAULT 0,
    xp_points INT DEFAULT 100,
    completed_sessions_count INT DEFAULT 0,
    role VARCHAR(30) DEFAULT 'ROLE_STUDENT',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Skill Categories Table
CREATE TABLE IF NOT EXISTS skill_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon_name VARCHAR(50),
    description VARCHAR(500)
);

-- 3. Skills Catalog Table
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category_id BIGINT,
    popular BOOLEAN DEFAULT FALSE,
    description VARCHAR(500),
    CONSTRAINT fk_skill_category FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE SET NULL
);

-- 4. Student Skills (Teach and Learn Lists)
CREATE TABLE IF NOT EXISTS student_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    proficiency VARCHAR(30) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'TEACH' or 'LEARN'
    experience_or_goal VARCHAR(500),
    CONSTRAINT fk_student_skill_user FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT uk_student_skill_type UNIQUE (student_id, skill_name, type)
);

-- 5. Exchange Requests
CREATE TABLE IF NOT EXISTS exchange_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    teaching_skill VARCHAR(100) NOT NULL,
    learning_skill VARCHAR(100) NOT NULL,
    message TEXT,
    preferred_mode VARCHAR(50) DEFAULT 'Online',
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    CONSTRAINT fk_req_sender FOREIGN KEY (sender_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_req_receiver FOREIGN KEY (receiver_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 6. Learning Sessions
CREATE TABLE IF NOT EXISTS learning_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT NOT NULL,
    learner_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    mode VARCHAR(50) DEFAULT 'Online',
    meeting_link_or_venue VARCHAR(255),
    description TEXT,
    status VARCHAR(30) DEFAULT 'UPCOMING',
    mentor_rating INT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_session_mentor FOREIGN KEY (mentor_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_session_learner FOREIGN KEY (learner_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 7. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'GENERAL',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_recipient FOREIGN KEY (recipient_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 8. Activities Feed
CREATE TABLE IF NOT EXISTS activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    student_id BIGINT,
    student_name VARCHAR(120),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reviewer_id BIGINT NOT NULL,
    reviewee_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    reported BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewee FOREIGN KEY (reviewee_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 10. Achievements & Badges
CREATE TABLE IF NOT EXISTS achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    icon_name VARCHAR(50),
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_achievement_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
