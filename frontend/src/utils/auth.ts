// Authentication utilities

export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  role: 'user' | 'admin' | 'superadmin';
  is_active: boolean;
  is_email_verified: boolean;
  created_at: string;
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
}

export function setUserData(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_data', JSON.stringify(user));
  }
}

export function getUserData(): User | null {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function getCurrentUser(): User | null {
  return getUserData();
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function isSuperAdmin(): boolean {
  const user = getUserData();
  return user?.role === 'superadmin';
}

export function isAdmin(): boolean {
  const user = getUserData();
  return user?.role === 'admin' || user?.role === 'superadmin';
}

export function logout(): void {
  removeAuthToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
}

// Server-side auth checks for Astro pages
export async function requireAuth(request?: Request): Promise<User | null> {
  // This is a placeholder for server-side auth check
  // In practice, this should verify the token server-side
  return null;
}

export function requireAdmin(): void {
  // Client-side admin check - redirect if not admin
  if (typeof window !== 'undefined') {
    const user = getUserData();
    const token = getAuthToken();
    
    if (!token || !user) {
      // Not logged in, redirect to login
      window.location.href = '/admin/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      // Not an admin, redirect to home
      alert('Access denied. Admin privileges required.');
      window.location.href = '/';
      return;
    }
  }
}

export function requireSuperAdmin(): void {
  // Client-side superadmin check - redirect if not superadmin
  if (typeof window !== 'undefined') {
    const user = getUserData();
    const token = getAuthToken();
    
    if (!token || !user) {
      window.location.href = '/admin/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    
    if (user.role !== 'superadmin') {
      alert('Access denied. SuperAdmin privileges required.');
      window.location.href = '/admin';
      return;
    }
  }
}
