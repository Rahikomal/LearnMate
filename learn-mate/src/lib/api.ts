const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail ?? "Request failed");
  }
  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Reviews ────────────────────────────────────────────────────────────────
export interface ReviewOut {
  id: number;
  reviewer_id: number;
  mentor_id: number;
  rating: number;
  comment?: string;
  skill_tag?: string;
  created_at: string;
}
export interface MentorRating {
  average_rating: number;
  total_count: number;
}
export interface ReviewCreate {
  mentor_id: number;
  rating: number;
  comment?: string;
  skill_tag?: string;
}

export const reviewsApi = {
  getMentorReviews: (mentorId: number) =>
    request<ReviewOut[]>(`/reviews/${mentorId}`),
  getMentorRating: (mentorId: number) =>
    request<MentorRating>(`/reviews/rating/${mentorId}`),
  submitReview: (data: ReviewCreate) =>
    request<ReviewOut>("/reviews/", { method: "POST", body: JSON.stringify(data) }),
};

// ─── Groups ─────────────────────────────────────────────────────────────────
export interface GroupOut {
  id: number;
  name: string;
  description?: string;
  skill_tag: string;
  creator_id: number;
  member_count: number;
  created_at: string;
}
export interface GroupPostOut {
  id: number;
  group_id: number;
  author_id: number;
  content: string;
  likes: number;
  created_at: string;
}
export interface GroupCreate {
  name: string;
  description?: string;
  skill_tag: string;
}

export const groupsApi = {
  listGroups: (skill?: string) =>
    request<GroupOut[]>(`/groups/${skill ? `?skill=${skill}` : ""}`),
  getPopularGroups: () => request<GroupOut[]>("/groups/popular"),
  createGroup: (data: GroupCreate) =>
    request<GroupOut>("/groups/", { method: "POST", body: JSON.stringify(data) }),
  joinGroup: (groupId: number) =>
    request<GroupOut>(`/groups/${groupId}/join`, { method: "POST" }),
  leaveGroup: (groupId: number) =>
    request<void>(`/groups/${groupId}/leave`, { method: "DELETE" }),
  getPosts: (groupId: number) =>
    request<GroupPostOut[]>(`/groups/${groupId}/posts`),
  createPost: (groupId: number, content: string) =>
    request<GroupPostOut>(`/groups/${groupId}/posts`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
  likePost: (postId: number) =>
    request<{ likes: number }>(`/groups/posts/${postId}/like`, { method: "POST" }),
};

// ─── Sessions ────────────────────────────────────────────────────────────────
export interface SessionOut {
  id: number;
  mentor_id: number;
  learner_id: number;
  skill_tag: string;
  scheduled_at: string;
  duration_mins: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  meet_link?: string;
  created_at: string;
}
export interface SessionCreate {
  mentor_id: number;
  skill_tag: string;
  scheduled_at: string;
  duration_mins: number;
  notes?: string;
}

export const sessionsApi = {
  getMySessions: () => request<SessionOut[]>("/sessions/me"),
  bookSession: (data: SessionCreate) =>
    request<SessionOut>("/sessions/", { method: "POST", body: JSON.stringify(data) }),
  confirmSession: (id: number) =>
    request<SessionOut>(`/sessions/${id}/confirm`, { method: "PATCH" }),
  completeSession: (id: number) =>
    request<SessionOut>(`/sessions/${id}/complete`, { method: "PATCH" }),
  cancelSession: (id: number) =>
    request<SessionOut>(`/sessions/${id}/cancel`, { method: "PATCH" }),
};
