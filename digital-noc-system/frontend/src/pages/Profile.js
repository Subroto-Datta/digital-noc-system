import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  User, 
  Mail, 
  Building, 
  GraduationCap, 
  Shield, 
  UserCheck,
  Save,
  Edit,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    studentId: user?.studentId || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // In a real app, you'd make an API call to update the profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-5 w-5" />;
      case 'faculty':
        return <UserCheck className="h-5 w-5" />;
      case 'admin':
        return <Shield className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="flex items-center space-x-2"
            >
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account information</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getRoleIcon(user?.role)}
              <Badge className={`${getRoleColor(user?.role)} border-0`}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>
                      Update your personal details and account information
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2"
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                      Department
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  {user?.role === 'student' && (
                    <div className="space-y-2">
                      <Label htmlFor="studentId" className="text-sm font-medium text-gray-700">
                        Student ID
                      </Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="studentId"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Account Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getRoleIcon(user?.role)}
                    <span className="font-medium text-gray-900">
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Link>
                </Button>
                
                {user?.role === 'student' && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/create-noc">
                      <User className="h-4 w-4 mr-2" />
                      Create NOC Request
                    </Link>
                  </Button>
                )}
                
                {(user?.role === 'faculty' || user?.role === 'admin') && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/admin">
                      <User className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;