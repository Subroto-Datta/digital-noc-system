import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Plus, 
  Settings, 
  LogOut, 
  User, 
  Menu, 
  X,
  Shield,
  UserCheck
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      student: 'Student',
      faculty: 'Faculty',
      admin: 'Administrator'
    };
    return roleMap[role] || role;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      case 'faculty':
        return <UserCheck className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'faculty':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  NOC Management
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Digital Platform</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              <Link to="/dashboard" className="flex items-center space-x-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
            
            {user?.role === 'student' && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                <Link to="/create-noc" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create NOC</span>
                </Link>
              </Button>
            )}
            
            {(user?.role === 'faculty' || user?.role === 'admin') && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                <Link to="/admin" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              </Button>
            )}

            {/* User Profile Dropdown */}
            <div className="relative ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 px-3 py-2 h-auto"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback className="text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-32" title={user?.name}>
                    {user?.name}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRoleColor(user?.role)} border-0`}
                  >
                    {getRoleIcon(user?.role)}
                    <span className="ml-1">{getRoleDisplayName(user?.role)}</span>
                  </Badge>
                </div>
              </Button>
              
              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs mt-1 ${getRoleColor(user?.role)} border-0`}
                    >
                      {getRoleIcon(user?.role)}
                      <span className="ml-1">{getRoleDisplayName(user?.role)}</span>
                    </Badge>
                  </div>
                  
                  <div className="py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start text-gray-700 hover:bg-gray-50"
                    >
                      <Link to="/profile" onClick={() => setIsProfileOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full justify-start text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              
              {user?.role === 'student' && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Link to="/create-noc" onClick={() => setIsMenuOpen(false)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create NOC
                  </Link>
                </Button>
              )}
              
              {(user?.role === 'faculty' || user?.role === 'admin') && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Link>
                </Button>
              )}

              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex items-center space-x-3 px-2 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={user?.name} />
                    <AvatarFallback className="text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs mt-1 ${getRoleColor(user?.role)} border-0`}
                    >
                      {getRoleIcon(user?.role)}
                      <span className="ml-1">{getRoleDisplayName(user?.role)}</span>
                    </Badge>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="w-full justify-start text-gray-700 hover:bg-gray-50"
                >
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <User className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Backdrop for profile dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;