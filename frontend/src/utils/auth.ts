// Auth utilities for user authentication and authorization

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}

// Get current user data
export function getCurrentUser(): any {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
}

// Check if user has admin role
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user && (user.role === 'admin' || user.role === 'superadmin');
}

// Check if user has superadmin role
export function isSuperAdmin(): boolean {
  const user = getCurrentUser();
  return user && user.role === 'superadmin';
}

// Logout user
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  window.location.href = '/auth/login';
}

// Redirect to login if not authenticated
export function requireAuth(redirectUrl = '/admin'): void {
  if (typeof window === 'undefined') return;
  
  if (!isAuthenticated()) {
    window.location.href = `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`;
  }
}

// Redirect to login if not admin
export function requireAdmin(): void {
  if (typeof window === 'undefined') return;
  
  if (!isAuthenticated()) {
    window.location.href = '/auth/login?redirect=/admin';
    return;
  }
  
  if (!isAdmin()) {
    alert('Access denied. Admin privileges required.');
    window.location.href = '/';
  }
}

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
