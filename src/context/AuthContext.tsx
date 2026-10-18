// DUO OS — Authentication & Dual-Student Profile Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, StudentPersona, SharedWorkspace } from '../lib/types';
import {
  getCurrentUser,
  getPartnerUser,
  getCurrentPersona,
  setCurrentPersona,
  getWorkspace,
  updateUserProfile,
  subscribeToStore
} from '../lib/store';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile;
  partner: UserProfile;
  currentPersona: StudentPersona;
  workspace: SharedWorkspace;
  switchPersona: (persona: StudentPersona) => void;
  updateProfile: (profile: UserProfile) => void;
  loginDemo: (persona: StudentPersona) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPersona, setPersonaState] = useState<StudentPersona>(getCurrentPersona());
  const [user, setUser] = useState<UserProfile>(getCurrentUser());
  const [partner, setPartner] = useState<UserProfile>(getPartnerUser());
  const [workspace, setWorkspace] = useState<SharedWorkspace>(getWorkspace());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    return subscribeToStore(() => {
      const p = getCurrentPersona();
      setPersonaState(p);
      setUser(getCurrentUser());
      setPartner(getPartnerUser());
      setWorkspace(getWorkspace());
    });
  }, []);

  const switchPersona = (newPersona: StudentPersona) => {
    setCurrentPersona(newPersona);
    setPersonaState(newPersona);
    const updatedUser = getCurrentUser();
    setUser(updatedUser);
    setPartner(getPartnerUser());
    toast.partner(
      `Switched to ${updatedUser.displayName}`,
      `Viewing workspace as ${updatedUser.degreeProgram} (${updatedUser.yearOfStudy}th Year)`
    );
  };

  const loginDemo = (persona: StudentPersona) => {
    setIsAuthenticated(true);
    switchPersona(persona);
  };

  const logout = () => {
    setIsAuthenticated(false);
    toast.info('Logged out from DUO OS');
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    updateUserProfile(profile);
    setUser(profile);
    toast.success('Profile & schedule settings saved successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        partner,
        currentPersona,
        workspace,
        switchPersona,
        updateProfile: handleUpdateProfile,
        loginDemo,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
