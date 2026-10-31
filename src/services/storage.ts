import {
  Student,
  SkillItem,
  StudentSkill,
  ExchangeRequest,
  LearningSession,
  ActivityLog,
  Announcement,
  ReviewItem,
  MutualSkillMatch,
  ProficiencyLevel,
  SkillCategoryName
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_SKILLS,
  INITIAL_REQUESTS,
  INITIAL_SESSIONS,
  INITIAL_ACTIVITIES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_REVIEWS
} from '../data/initialData';

const DB_KEY = 'peerlearn_storage_v1';
const CURRENT_USER_KEY = 'peerlearn_current_user_id';
const ADMIN_AUTH_KEY = 'peerlearn_is_admin';

interface StorageSchema {
  students: Student[];
  skills: SkillItem[];
  requests: ExchangeRequest[];
  sessions: LearningSession[];
  activities: ActivityLog[];
  announcements: Announcement[];
  reviews: ReviewItem[];
}

class StorageService {
  private data: StorageSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): StorageSchema {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      console.warn('Could not read from localStorage, using initial dataset');
    }

    const initial: StorageSchema = {
      students: INITIAL_STUDENTS,
      skills: INITIAL_SKILLS,
      requests: INITIAL_REQUESTS,
      sessions: INITIAL_SESSIONS,
      activities: INITIAL_ACTIVITIES,
      announcements: INITIAL_ANNOUNCEMENTS,
      reviews: INITIAL_REVIEWS,
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: StorageSchema) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      this.data = data;
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  // --- Reset to default for easy live demo resets ---
  public resetToDefaults(): void {
    const fresh: StorageSchema = {
      students: INITIAL_STUDENTS,
      skills: INITIAL_SKILLS,
      requests: INITIAL_REQUESTS,
      sessions: INITIAL_SESSIONS,
      activities: INITIAL_ACTIVITIES,
      announcements: INITIAL_ANNOUNCEMENTS,
      reviews: INITIAL_REVIEWS,
    };
    this.saveData(fresh);
    this.setCurrentUserId('student-srija');
    this.setAdmin(false);
  }

  // --- Session / Current Student ---
  public getCurrentUserId(): string {
    const id = localStorage.getItem(CURRENT_USER_KEY);
    return id || 'student-srija';
  }

  public setCurrentUserId(id: string): void {
    localStorage.setItem(CURRENT_USER_KEY, id);
  }

  public getCurrentStudent(): Student | null {
    const id = this.getCurrentUserId();
    return this.data.students.find(s => s.id === id && s.status === 'ACTIVE') || this.data.students[0] || null;
  }

  // --- Admin Session ---
  public isAdmin(): boolean {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  }

  public setAdmin(status: boolean): void {
    localStorage.setItem(ADMIN_AUTH_KEY, status ? 'true' : 'false');
  }

  // --- Students CRUD ---
  public getStudents(includeDeactivated = false): Student[] {
    if (includeDeactivated) return [...this.data.students];
    return this.data.students.filter(s => s.status === 'ACTIVE');
  }

  public getStudentById(id: string): Student | undefined {
    return this.data.students.find(s => s.id === id);
  }

  public registerStudent(studentData: Omit<Student, 'id' | 'rating' | 'reviewCount' | 'xpPoints' | 'completedSessionsCount' | 'badges' | 'status' | 'createdAt'>): Student {
    const existing = this.data.students.find(s => s.email.toLowerCase() === studentData.email.toLowerCase());
    if (existing) {
      throw new Error('A student with this email is already registered.');
    }

    const newStudent: Student = {
      ...studentData,
      id: `student-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      xpPoints: 100, // Welcome bonus
      completedSessionsCount: 0,
      badges: ['New Explorer'],
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      avatarBg: '#7546D8',
      avatarColor: '#FFFFFF',
    };

    const updated = [newStudent, ...this.data.students];
    this.saveData({ ...this.data, students: updated });
    this.setCurrentUserId(newStudent.id);

    this.logActivity({
      type: 'SKILL_ADDED',
      title: 'Student Joined',
      description: `${newStudent.name} joined PeerLearn from ${newStudent.collegeName}.`,
      studentId: newStudent.id,
      studentName: newStudent.name
    });

    return newStudent;
  }

  public updateStudent(id: string, updates: Partial<Student>): Student {
    const index = this.data.students.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Student not found');
    const updated = [...this.data.students];
    updated[index] = { ...updated[index], ...updates };
    this.saveData({ ...this.data, students: updated });
    return updated[index];
  }

  public toggleStudentStatus(id: string): Student {
    const student = this.getStudentById(id);
    if (!student) throw new Error('Student not found');
    const newStatus = student.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    return this.updateStudent(id, { status: newStatus });
  }

  public deleteStudent(id: string): void {
    const updated = this.data.students.filter(s => s.id !== id);
    this.saveData({ ...this.data, students: updated });
    if (this.getCurrentUserId() === id) {
      this.setCurrentUserId('student-srija');
    }
  }

  // --- Student Skills Management ---
  public addStudentSkill(studentId: string, skill: Omit<StudentSkill, 'id'>): Student {
    const student = this.getStudentById(studentId);
    if (!student) throw new Error('Student not found');

    const duplicate = student.skills.some(
      s => s.type === skill.type && s.skillName.toLowerCase() === skill.skillName.toLowerCase()
    );
    if (duplicate) {
      throw new Error(`You already have "${skill.skillName}" in your ${skill.type === 'TEACH' ? 'teaching' : 'learning'} list.`);
    }

    const newSkill: StudentSkill = {
      ...skill,
      id: `sk-${Date.now()}`
    };

    const updatedSkills = [...student.skills, newSkill];
    const updatedStudent = this.updateStudent(studentId, { skills: updatedSkills });

    this.logActivity({
      type: 'SKILL_ADDED',
      title: 'New Skill Cataloged',
      description: `${student.name} added "${newSkill.skillName}" (${newSkill.proficiency}) to ${newSkill.type === 'TEACH' ? 'skills they teach' : 'skills they want to learn'}.`,
      studentId: student.id,
      studentName: student.name
    });

    return updatedStudent;
  }

  public removeStudentSkill(studentId: string, skillId: string): Student {
    const student = this.getStudentById(studentId);
    if (!student) throw new Error('Student not found');
    const updatedSkills = student.skills.filter(s => s.id !== skillId);
    return this.updateStudent(studentId, { skills: updatedSkills });
  }

  public updateStudentSkillProficiency(studentId: string, skillId: string, proficiency: ProficiencyLevel): Student {
    const student = this.getStudentById(studentId);
    if (!student) throw new Error('Student not found');
    const updatedSkills = student.skills.map(s => (s.id === skillId ? { ...s, proficiency } : s));
    return this.updateStudent(studentId, { skills: updatedSkills });
  }

  // --- Global Skills Catalog ---
  public getAllSkills(): SkillItem[] {
    return [...this.data.skills];
  }

  public addCatalogSkill(name: string, category: SkillCategoryName): SkillItem {
    const exists = this.data.skills.some(s => s.name.toLowerCase() === name.toLowerCase());
    if (exists) throw new Error('Skill already exists in catalog.');
    const newSkill: SkillItem = {
      id: `cat-${Date.now()}`,
      name,
      category,
      popular: false
    };
    this.saveData({ ...this.data, skills: [...this.data.skills, newSkill] });
    return newSkill;
  }

  public deleteCatalogSkill(id: string): void {
    this.saveData({ ...this.data, skills: this.data.skills.filter(s => s.id !== id) });
  }

  // --- Smart Mutual Skill Matching Algorithm ---
  public getMatchesForStudent(currentStudentId: string): MutualSkillMatch[] {
    const currentStudent = this.getStudentById(currentStudentId);
    if (!currentStudent || currentStudent.status !== 'ACTIVE') return [];

    const currentTeach = currentStudent.skills.filter(s => s.type === 'TEACH');
    const currentLearn = currentStudent.skills.filter(s => s.type === 'LEARN');

    const matches: MutualSkillMatch[] = [];

    const otherStudents = this.getStudents().filter(s => s.id !== currentStudentId);

    for (const other of otherStudents) {
      const otherTeach = other.skills.filter(s => s.type === 'TEACH');
      const otherLearn = other.skills.filter(s => s.type === 'LEARN');

      // What current student can teach that other student wants to learn:
      const whatYouTeachThem: string[] = [];
      for (const t of currentTeach) {
        if (otherLearn.some(l => l.skillName.toLowerCase() === t.skillName.toLowerCase())) {
          whatYouTeachThem.push(t.skillName);
        }
      }

      // What other student can teach that current student wants to learn:
      const whatTheyTeachYou: string[] = [];
      for (const t of otherTeach) {
        if (currentLearn.some(l => l.skillName.toLowerCase() === t.skillName.toLowerCase())) {
          whatTheyTeachYou.push(t.skillName);
        }
      }

      if (whatYouTeachThem.length > 0 && whatTheyTeachYou.length > 0) {
        // MUTUAL MATCH! Reciprocal learning opportunity.
        // Base: 85%, +5% for multiple matching skills, capped at 100%
        const score = Math.min(100, 85 + (whatYouTeachThem.length + whatTheyTeachYou.length - 2) * 5 + 10);
        matches.push({
          student: other,
          matchType: 'MUTUAL',
          matchPercentage: score,
          whatYouTeachThem,
          whatTheyTeachYou
        });
      } else if (whatTheyTeachYou.length > 0) {
        // They can teach you
        matches.push({
          student: other,
          matchType: 'ONE_WAY_LEARN',
          matchPercentage: 65,
          whatYouTeachThem: [],
          whatTheyTeachYou
        });
      } else if (whatYouTeachThem.length > 0) {
        // You can teach them
        matches.push({
          student: other,
          matchType: 'ONE_WAY_TEACH',
          matchPercentage: 60,
          whatYouTeachThem,
          whatTheyTeachYou: []
        });
      }
    }

    // Sort: Mutual matches first (highest percentage), then others
    return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  // --- Exchange Requests Workflow ---
  public getRequests(): ExchangeRequest[] {
    return [...this.data.requests];
  }

  public getRequestsForStudent(studentId: string): {
    incoming: ExchangeRequest[];
    sent: ExchangeRequest[];
    accepted: ExchangeRequest[];
  } {
    const all = this.data.requests;
    return {
      incoming: all.filter(r => r.receiverId === studentId && r.status === 'PENDING'),
      sent: all.filter(r => r.senderId === studentId && r.status === 'PENDING'),
      accepted: all.filter(
        r => (r.senderId === studentId || r.receiverId === studentId) && r.status === 'ACCEPTED'
      ),
    };
  }

  public sendExchangeRequest(params: {
    receiverId: string;
    teachingSkill: string;
    learningSkill: string;
    message: string;
    preferredMode: 'Online' | 'Offline' | 'Either';
  }): ExchangeRequest {
    const sender = this.getCurrentStudent();
    if (!sender) throw new Error('You must be logged in as a student');
    const receiver = this.getStudentById(params.receiverId);
    if (!receiver) throw new Error('Recipient student not found');

    // Prevent duplicate pending request
    const existing = this.data.requests.find(
      r =>
        ((r.senderId === sender.id && r.receiverId === receiver.id) ||
         (r.senderId === receiver.id && r.receiverId === sender.id)) &&
        r.status === 'PENDING'
    );
    if (existing) {
      throw new Error('A pending exchange request already exists between you and this student.');
    }

    const newRequest: ExchangeRequest = {
      id: `req-${Date.now()}`,
      senderId: sender.id,
      senderName: sender.name,
      senderCollege: sender.collegeName,
      senderAvatarBg: sender.avatarBg || '#7546D8',
      receiverId: receiver.id,
      receiverName: receiver.name,
      receiverCollege: receiver.collegeName,
      receiverAvatarBg: receiver.avatarBg || '#5425A8',
      teachingSkill: params.teachingSkill,
      learningSkill: params.learningSkill,
      message: params.message,
      preferredMode: params.preferredMode,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    const updated = [newRequest, ...this.data.requests];
    this.saveData({ ...this.data, requests: updated });

    this.logActivity({
      type: 'REQUEST',
      title: 'Exchange Request Sent',
      description: `${sender.name} proposed to teach "${params.teachingSkill}" to ${receiver.name} in exchange for "${params.learningSkill}".`,
      studentId: sender.id,
      studentName: sender.name
    });

    return newRequest;
  }

  public acceptExchangeRequest(requestId: string): ExchangeRequest {
    const req = this.data.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const updatedReq: ExchangeRequest = {
      ...req,
      status: 'ACCEPTED',
      updatedAt: new Date().toISOString()
    };

    const updatedList = this.data.requests.map(r => (r.id === requestId ? updatedReq : r));
    this.saveData({ ...this.data, requests: updatedList });

    this.logActivity({
      type: 'ACCEPT',
      title: 'Exchange Request Accepted',
      description: `${req.receiverName} accepted ${req.senderName}'s skill exchange (${req.teachingSkill} ⇄ ${req.learningSkill}). Ready to schedule sessions!`,
      studentId: req.receiverId,
      studentName: req.receiverName
    });

    return updatedReq;
  }

  public rejectExchangeRequest(requestId: string): ExchangeRequest {
    const req = this.data.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const updatedReq: ExchangeRequest = {
      ...req,
      status: 'REJECTED',
      updatedAt: new Date().toISOString()
    };

    const updatedList = this.data.requests.map(r => (r.id === requestId ? updatedReq : r));
    this.saveData({ ...this.data, requests: updatedList });
    return updatedReq;
  }

  public cancelExchangeRequest(requestId: string): ExchangeRequest {
    const req = this.data.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const updatedReq: ExchangeRequest = {
      ...req,
      status: 'CANCELLED',
      updatedAt: new Date().toISOString()
    };

    const updatedList = this.data.requests.map(r => (r.id === requestId ? updatedReq : r));
    this.saveData({ ...this.data, requests: updatedList });
    return updatedReq;
  }

  // --- Learning Sessions Workflow ---
  public getSessions(): LearningSession[] {
    return [...this.data.sessions];
  }

  public getSessionsForStudent(studentId: string): {
    upcoming: LearningSession[];
    completed: LearningSession[];
  } {
    const userSessions = this.data.sessions.filter(
      s => s.mentorId === studentId || s.learnerId === studentId
    );
    return {
      upcoming: userSessions.filter(s => s.status === 'UPCOMING').sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
      completed: userSessions.filter(s => s.status === 'COMPLETED').sort((a, b) => (b.completedAt || b.date).localeCompare(a.completedAt || a.date)),
    };
  }

  public scheduleSession(params: {
    requestId?: string;
    peerStudentId: string;
    skillName: string;
    date: string;
    time: string;
    durationMinutes: number;
    mode: 'Online' | 'Offline';
    meetingLinkOrVenue: string;
    description: string;
    iAmTeaching: boolean;
  }): LearningSession {
    const current = this.getCurrentStudent();
    if (!current) throw new Error('Student not logged in');
    const peer = this.getStudentById(params.peerStudentId);
    if (!peer) throw new Error('Peer student not found');

    // Rule: Must have accepted connection to schedule
    const hasAcceptedConnection = this.data.requests.some(
      r =>
        r.status === 'ACCEPTED' &&
        ((r.senderId === current.id && r.receiverId === peer.id) ||
         (r.senderId === peer.id && r.receiverId === current.id))
    );

    if (!hasAcceptedConnection) {
      throw new Error('You can only schedule sessions with peers who have an accepted exchange connection.');
    }

    const mentorId = params.iAmTeaching ? current.id : peer.id;
    const mentorName = params.iAmTeaching ? current.name : peer.name;
    const learnerId = params.iAmTeaching ? peer.id : current.id;
    const learnerName = params.iAmTeaching ? peer.name : current.name;

    const newSession: LearningSession = {
      id: `sess-${Date.now()}`,
      requestId: params.requestId,
      mentorId,
      mentorName,
      learnerId,
      learnerName,
      skillName: params.skillName,
      date: params.date,
      time: params.time,
      durationMinutes: params.durationMinutes,
      mode: params.mode,
      meetingLinkOrVenue: params.meetingLinkOrVenue,
      description: params.description,
      status: 'UPCOMING',
      createdAt: new Date().toISOString()
    };

    const updated = [newSession, ...this.data.sessions];
    this.saveData({ ...this.data, sessions: updated });

    this.logActivity({
      type: 'SESSION_SCHEDULED',
      title: 'Learning Session Scheduled',
      description: `${mentorName} will mentor ${learnerName} on "${params.skillName}" on ${params.date} at ${params.time}.`,
      studentId: mentorId,
      studentName: mentorName
    });

    return newSession;
  }

  public completeSession(sessionId: string, rating = 5, feedbackNote = ''): LearningSession {
    const session = this.data.sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    const completedSession: LearningSession = {
      ...session,
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      notes: feedbackNote || session.notes,
      mentorRating: rating
    };

    const updatedSessions = this.data.sessions.map(s => (s.id === sessionId ? completedSession : s));

    // Award +100 XP to the mentor, and +50 XP to the learner for participating!
    const mentor = this.getStudentById(session.mentorId);
    if (mentor) {
      const updatedXp = (mentor.xpPoints || 0) + 100;
      const updatedCompleted = (mentor.completedSessionsCount || 0) + 1;
      const updatedRating = Math.min(5.0, Number(((mentor.rating * mentor.reviewCount + rating) / (mentor.reviewCount + 1)).toFixed(2)));
      this.updateStudent(mentor.id, {
        xpPoints: updatedXp,
        completedSessionsCount: updatedCompleted,
        rating: updatedRating,
        reviewCount: mentor.reviewCount + 1
      });
    }

    const learner = this.getStudentById(session.learnerId);
    if (learner) {
      const updatedXp = (learner.xpPoints || 0) + 50;
      const updatedCompleted = (learner.completedSessionsCount || 0) + 1;
      this.updateStudent(learner.id, {
        xpPoints: updatedXp,
        completedSessionsCount: updatedCompleted
      });
    }

    this.saveData({ ...this.data, sessions: updatedSessions });

    this.logActivity({
      type: 'SESSION_COMPLETED',
      title: 'Session Successfully Completed',
      description: `${session.mentorName} completed peer session with ${session.learnerName} on "${session.skillName}". +100 XP awarded!`,
      studentId: session.mentorId,
      studentName: session.mentorName
    });

    return completedSession;
  }

  public cancelSession(sessionId: string): LearningSession {
    const session = this.data.sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    const cancelled: LearningSession = {
      ...session,
      status: 'CANCELLED'
    };

    const updated = this.data.sessions.map(s => (s.id === sessionId ? cancelled : s));
    this.saveData({ ...this.data, sessions: updated });
    return cancelled;
  }

  // --- Activities ---
  public getActivities(limit = 20): ActivityLog[] {
    return this.data.activities.slice(0, limit);
  }

  private logActivity(entry: Omit<ActivityLog, 'id' | 'timestamp'>): void {
    const log: ActivityLog = {
      ...entry,
      id: `act-${Date.now()}`,
      timestamp: 'Just now'
    };
    const updated = [log, ...this.data.activities.slice(0, 49)];
    this.saveData({ ...this.data, activities: updated });
  }

  // --- Announcements ---
  public getAnnouncements(): Announcement[] {
    return [...this.data.announcements];
  }

  public addAnnouncement(title: string, content: string, priority: 'NORMAL' | 'HIGH' | 'URGENT' = 'NORMAL'): Announcement {
    const ann: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      priority,
      author: 'Campus Academic Council / Admin',
      createdAt: new Date().toISOString()
    };
    this.saveData({ ...this.data, announcements: [ann, ...this.data.announcements] });
    return ann;
  }

  public deleteAnnouncement(id: string): void {
    this.saveData({ ...this.data, announcements: this.data.announcements.filter(a => a.id !== id) });
  }

  // --- Reviews & Moderation ---
  public getReviews(): ReviewItem[] {
    return [...this.data.reviews];
  }

  public reportReview(id: string): void {
    const updated = this.data.reviews.map(r => (r.id === id ? { ...r, reported: true } : r));
    this.saveData({ ...this.data, reviews: updated });
  }

  public deleteReview(id: string): void {
    this.saveData({ ...this.data, reviews: this.data.reviews.filter(r => r.id !== id) });
  }

  // --- Admin Aggregated Statistics ---
  public getAdminStats() {
    const students = this.data.students;
    const activeStudents = students.filter(s => s.status === 'ACTIVE').length;
    const totalSkills = this.data.skills.length;
    const totalRequests = this.data.requests.length;
    const completedSessions = this.data.sessions.filter(s => s.status === 'COMPLETED').length;
    const upcomingSessions = this.data.sessions.filter(s => s.status === 'UPCOMING').length;

    // Calculate total mutual matches across all pairs
    let totalMutualMatches = 0;
    for (let i = 0; i < students.length; i++) {
      for (let j = i + 1; j < students.length; j++) {
        const s1 = students[i];
        const s2 = students[j];
        const s1Teach = s1.skills.filter(s => s.type === 'TEACH').map(s => s.skillName.toLowerCase());
        const s1Learn = s1.skills.filter(s => s.type === 'LEARN').map(s => s.skillName.toLowerCase());
        const s2Teach = s2.skills.filter(s => s.type === 'TEACH').map(s => s.skillName.toLowerCase());
        const s2Learn = s2.skills.filter(s => s.type === 'LEARN').map(s => s.skillName.toLowerCase());

        const has1To2 = s1Teach.some(st => s2Learn.includes(st));
        const has2To1 = s2Teach.some(st => s1Learn.includes(st));
        if (has1To2 && has2To1) {
          totalMutualMatches++;
        }
      }
    }

    return {
      totalStudents: students.length,
      activeStudents,
      totalSkills,
      totalMutualMatches,
      totalRequests,
      completedSessions,
      upcomingSessions,
    };
  }
}

export const storage = new StorageService();
