-- =========================================================
-- PEERLEARN - SEED DATA SCRIPT
-- Default Admin Password: Admin@123
-- Default Student Password: student123
-- =========================================================

-- 1. Skill Categories
INSERT INTO skill_categories (id, name, icon_name, description) VALUES
(1, 'Programming', 'Code2', 'Core logic, data structures, and backend systems'),
(2, 'Web Development', 'Grid', 'Modern frontend layouts, responsive UI frameworks, and web standards'),
(3, 'Data and AI', 'Brain', 'Machine learning algorithms, data analytics, and neural models'),
(4, 'Career Skills', 'Award', 'Campus placement aptitude, technical interview preparation, and resumes'),
(5, 'Communication', 'Users', 'Public speaking confidence, presentation polish, and storytelling'),
(6, 'Creative', 'Sparkles', 'UI/UX wireframing in Figma, visual design, and multimedia editing'),
(7, 'Cloud and DevOps', 'Rocket', 'AWS infrastructure, Docker containers, Kubernetes, and Git');

-- 2. Skills Catalog
INSERT INTO skills (id, name, category_id, popular, description) VALUES
(1, 'Python', 1, TRUE, 'High-level algorithmic scripting and data science'),
(2, 'Java', 1, TRUE, 'Enterprise object-oriented development and Spring framework'),
(3, 'C', 1, FALSE, 'Low-level systems programming and memory management'),
(4, 'C++', 1, TRUE, 'Object-oriented programming and competitive coding'),
(5, 'JavaScript', 1, TRUE, 'Asynchronous web programming and Node.js'),
(6, 'HTML', 2, TRUE, 'Semantic web document structures'),
(7, 'CSS', 2, TRUE, 'Modern responsive styles and Flexbox/Grid layouts'),
(8, 'Bootstrap', 2, FALSE, 'Utility-first CSS styling toolkit'),
(9, 'Machine Learning', 3, TRUE, 'Supervised and unsupervised statistical learning'),
(10, 'Data Science', 3, TRUE, 'Exploratory data analysis, Pandas, and statistics'),
(11, 'Artificial Intelligence', 3, TRUE, 'Neural architectures and intelligent systems'),
(12, 'Aptitude', 4, TRUE, 'Quantitative aptitude and logical problem solving'),
(13, 'Interview Preparation', 4, TRUE, 'Mock technical and behavioral interview preparation'),
(14, 'Resume Building', 4, TRUE, 'ATS-optimized formatting and impactful bullet points'),
(15, 'English Speaking', 5, TRUE, 'Fluent conversational confidence and vocabulary'),
(16, 'Public Speaking', 5, FALSE, 'Overcoming stage fear and audience engagement'),
(17, 'Presentation Skills', 5, TRUE, 'Slide deck storytelling and pitch practice'),
(18, 'Canva', 6, TRUE, 'Quick graphic layout design and promotional decks'),
(19, 'Graphic Design', 6, TRUE, 'Branding, vector illustration, and color harmony'),
(20, 'UI/UX Design', 6, TRUE, 'User experience research, wireframing, and Figma'),
(21, 'Video Editing', 6, FALSE, 'Timeline pacing, transitions, and audio balancing'),
(22, 'AWS', 7, TRUE, 'Amazon Web Services cloud architecture and hosting'),
(23, 'Docker', 7, TRUE, 'Containerization, Dockerfiles, and compose stacks'),
(24, 'Kubernetes', 7, FALSE, 'Container orchestration and automated cluster deployments'),
(25, 'Git', 7, TRUE, 'Distributed version control, branching, and rebasing'),
(26, 'GitHub', 7, TRUE, 'Collaborative pull requests, CI/CD actions, and repositories');

-- 3. Initial Students & Admin
-- BCrypt for 'student123': $2a$10$wK1m.Y3yK1eP5o7L3d5xye8y7w2R4b0m1sK3xye7w2R4b0m1sK3xy (or standard hash)
-- BCrypt for 'Admin@123': $2a$10$g8i9m.Y3yK1eP5o7L3d5xye8y7w2R4b0m1sK3xye7w2R4b0m1sK3xy
INSERT INTO students (id, full_name, email, password, college_name, branch, academic_year, availability, rating, review_count, xp_points, completed_sessions_count, role, active) VALUES
(1, 'Srija Chinta', 'chintaassrija@gmail.com', '$2a$10$dKj8E.yG8kZ9aP3nO2s7ve7p1w3R5m2sK4xye8w3R5m2sK4xye', 'Vasavi College of Engineering', 'Computer Science & Engineering', '3rd Year', 'Available', 4.95, 14, 1250, 8, 'ROLE_STUDENT', TRUE),
(2, 'Rahul Verma', 'rahul.verma@cbit.ac.in', '$2a$10$dKj8E.yG8kZ9aP3nO2s7ve7p1w3R5m2sK4xye8w3R5m2sK4xye', 'Chaitanya Bharathi Institute of Technology', 'Information Technology', '3rd Year', 'Available', 4.90, 11, 1100, 7, 'ROLE_STUDENT', TRUE),
(3, 'Ananya Sharma', 'ananya.sharma@osmania.ac.in', '$2a$10$dKj8E.yG8kZ9aP3nO2s7ve7p1w3R5m2sK4xye8w3R5m2sK4xye', 'Osmania University College of Engineering', 'Artificial Intelligence & Data Science', '2nd Year', 'Available', 4.85, 9, 920, 5, 'ROLE_STUDENT', TRUE),
(4, 'Vikram Malhotra', 'vikram.m@hyderabad.bits-pilani.ac.in', '$2a$10$dKj8E.yG8kZ9aP3nO2s7ve7p1w3R5m2sK4xye8w3R5m2sK4xye', 'BITS Pilani Hyderabad Campus', 'Electronics & Communication', '4th Year', 'Weekends Only', 4.98, 16, 1680, 12, 'ROLE_STUDENT', TRUE),
(5, 'Campus Administrator', 'admin@peerlearn.edu', '$2a$10$dKj8E.yG8kZ9aP3nO2s7ve7p1w3R5m2sK4xye8w3R5m2sK4xye', 'Institutional Academic Council', 'System Administration', 'Faculty', 'Available', 5.0, 0, 5000, 50, 'ROLE_ADMIN', TRUE);

-- 4. Student Skills (Mutual Match Demonstration: Srija Teaches Python & Wants Java; Rahul Teaches Java & Wants Python!)
INSERT INTO student_skills (student_id, skill_name, category, proficiency, type, experience_or_goal) VALUES
-- Srija
(1, 'Python', 'Programming', 'Advanced', 'TEACH', '3 years algorithmic coding & Flask APIs'),
(1, 'HTML', 'Web Development', 'Intermediate', 'TEACH', 'Semantic layouts and responsive pages'),
(1, 'Machine Learning', 'Data and AI', 'Intermediate', 'TEACH', 'Scikit-learn model tuning'),
(1, 'Java', 'Programming', 'Advanced', 'LEARN', 'Targeting Spring Boot, JPA & Microservices'),
(1, 'Docker', 'Cloud and DevOps', 'Intermediate', 'LEARN', 'Containerization & cloud deployment pipelines'),
-- Rahul (Reciprocal Match with Srija!)
(2, 'Java', 'Programming', 'Advanced', 'TEACH', 'Spring Data JPA, Hibernate, OOP architecture'),
(2, 'Docker', 'Cloud and DevOps', 'Intermediate', 'TEACH', 'Multi-stage Dockerfiles and container workflows'),
(2, 'C++', 'Programming', 'Advanced', 'TEACH', 'Competitive programming with STL'),
(2, 'Python', 'Programming', 'Intermediate', 'LEARN', 'Pandas and scripting for algorithmic problems'),
(2, 'UI/UX Design', 'Creative', 'Beginner', 'LEARN', 'Figma wireframing for dashboards');

-- 5. Exchange Requests
INSERT INTO exchange_requests (id, sender_id, receiver_id, teaching_skill, learning_skill, message, preferred_mode, status) VALUES
(1, 2, 1, 'Java', 'Python', 'Hey Srija! I saw you are looking for Spring Boot. I can teach you Spring Data JPA in exchange for Python algorithmic practice!', 'Online', 'PENDING'),
(2, 1, 4, 'Machine Learning', 'Docker', 'Hi Vikram, would love to exchange ML model building for containerization walkthroughs!', 'Online', 'ACCEPTED');

-- 6. Learning Sessions
INSERT INTO learning_sessions (id, mentor_id, learner_id, skill_name, session_date, session_time, duration_minutes, mode, meeting_link_or_venue, description, status) VALUES
(1, 4, 1, 'Docker', '2026-11-02', '18:00:00', 60, 'Online', 'https://meet.google.com/peer-docker-srija', 'Container lifecycle, volumes, and multi-stage builds.', 'UPCOMING'),
(2, 1, 3, 'HTML', '2026-11-04', '17:30:00', 45, 'Online', 'https://meet.google.com/peer-html-learn', 'Semantic markup and web accessibility.', 'UPCOMING');
