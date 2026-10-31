
const API_BASE_URL = '/api';

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const responseText = await response.text();

  let data: any = null;

  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = responseText;
  }

  if (!response.ok) {
    throw new Error(
      typeof data === 'string'
        ? data
        : data?.message ||
          data?.error ||
          `Request failed: ${response.status}`
    );
  }

  return data as T;
}

export interface AuthResponse {
  studentId: number;
  success: boolean;
  fullName: string;
  email: string;
  collegeName: string;
  branch: string;
  academicYear: string;
  role: string;
  message?: string;
}

export interface StudentSkillInput {
  skillName: string;
  category: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'TEACH' | 'LEARN';
  experienceOrGoal?: string;
}

export const api = {
  // Student Login
  login: (email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Student Registration
  register: (student: {
    fullName: string;
    email: string;
    password: string;
    collegeName: string;
    branch: string;
    academicYear: string;
    bio?: string;
  }) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(student),
    }),

  // Get all students
  getStudents: () =>
    apiRequest<any[]>('/students'),

  // Get one student
  getStudent: (id: string | number) =>
    apiRequest<any>(`/students/${id}`),

  // Add a skill
  addStudentSkill: (
    studentId: string | number,
    skill: StudentSkillInput
  ) =>
    apiRequest<any>(`/students/${studentId}/skills`, {
      method: 'POST',
      body: JSON.stringify({
        skillName: skill.skillName,
        category: skill.category,
        proficiency: skill.proficiency,
        type: skill.type,
        experienceOrGoal: skill.experienceOrGoal,
      }),
    }),

  // Delete a skill
  deleteStudentSkill: (
    studentId: string | number,
    skillId: string | number
  ) =>
    apiRequest<any>(
      `/students/${studentId}/skills/${skillId}`,
      {
        method: 'DELETE',
      }
    ),

  // Update skill proficiency
  updateSkillProficiency: (
    studentId: string | number,
    skillId: string | number,
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced'
  ) =>
    apiRequest<any>(
      `/students/${studentId}/skills/${skillId}/proficiency?proficiency=${encodeURIComponent(proficiency)}`,
      {
        method: 'PUT',
      }
    ),
};
