export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type SkillCategoryName =
  | 'Programming'
  | 'Web Development'
  | 'Data and AI'
  | 'Career Skills'
  | 'Communication'
  | 'Creative'
  | 'Cloud and DevOps';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategoryName;
  iconName?: string;
  popular?: boolean;
}

export interface StudentSkill {
  id: string;
  skillName: string;
  category: SkillCategoryName;
  proficiency: ProficiencyLevel;
  type: 'TEACH' | 'LEARN';
  yearsExperienceOrGoal?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  password?: string;
  collegeName: string;
  branch: string;
  academicYear: string; // e.g. "1st Year", "2nd Year", "3rd Year", "4th Year"
  avatarUrl?: string;
  avatarBg?: string;
  avatarColor?: string;
  bio?: string;
  availability: 'Available' | 'Busy' | 'Weekends Only';
  rating: number; // e.g. 4.9
  reviewCount: number;
  xpPoints: number;
  completedSessionsCount: number;
  badges: string[];
  skills: StudentSkill[];
  status: 'ACTIVE' | 'DEACTIVATED';
  createdAt: string;
}

export interface MutualSkillMatch {
  student: Student;
  matchType: 'MUTUAL' | 'ONE_WAY_TEACH' | 'ONE_WAY_LEARN';
  matchPercentage: number;
  whatYouTeachThem: string[];
  whatTheyTeachYou: string[];
}

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface ExchangeRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderCollege: string;
  senderAvatarBg?: string;
  receiverId: string;
  receiverName: string;
  receiverCollege: string;
  receiverAvatarBg?: string;
  teachingSkill: string; // Skill sender offers to teach
  learningSkill: string; // Skill sender wants to learn from receiver
  message: string;
  preferredMode: 'Online' | 'Offline' | 'Either';
  status: RequestStatus;
  createdAt: string;
  updatedAt?: string;
}

export type SessionStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export interface LearningSession {
  id: string;
  requestId?: string;
  mentorId: string;
  mentorName: string;
  learnerId: string;
  learnerName: string;
  skillName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  mode: 'Online' | 'Offline';
  meetingLinkOrVenue: string;
  description: string;
  status: SessionStatus;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  mentorRating?: number;
  learnerRating?: number;
}

export interface ActivityLog {
  id: string;
  type: 'MATCH' | 'REQUEST' | 'ACCEPT' | 'SESSION_SCHEDULED' | 'SESSION_COMPLETED' | 'SKILL_ADDED';
  title: string;
  description: string;
  studentId: string;
  studentName: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  author: string;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  fromStudentName: string;
  toStudentName: string;
  rating: number;
  comment: string;
  date: string;
  reported?: boolean;
}
