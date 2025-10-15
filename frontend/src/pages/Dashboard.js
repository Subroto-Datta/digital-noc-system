import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  TrendingUp,
  Calendar,
  Building,
  Target,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [nocRequests, setNocRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (user && user._id) {
        // Only fetch NOC requests for students
        if (user.role === 'student') {
          await fetchNOCRequests();
        }
      }
    };
    fetchData();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect faculty/admin to admin dashboard
  if (user && user.role !== 'student') {
    return <Navigate to="/admin" replace />;
  }

  const fetchNOCRequests = async () => {
    try {
      if (!user || !user._id) {
        console.log('User or user._id not available:', { user });
        setError('User information not available');
        setLoading(false);
        return;
      }
      
      console.log('Fetching NOC requests for user:', user._id);
      const response = await axios.get(`/api/noc/user/${user._id}`);
      console.log('NOC requests response:', response.data);
      setNocRequests(response.data.nocRequests || []);
    } catch (error) {
      console.error('Error fetching NOC requests:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (error.response?.status === 403) {
        setError('Access denied. You do not have permission to view NOC requests.');
      } else {
        setError(`Failed to load NOC requests: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        variant: 'warning', 
        icon: Clock, 
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      approved: { 
        variant: 'success', 
        icon: CheckCircle, 
        label: 'Approved',
        className: 'bg-green-100 text-green-800 border-green-200'
      },
      rejected: { 
        variant: 'destructive', 
        icon: XCircle, 
        label: 'Rejected',
        className: 'bg-red-100 text-red-800 border-red-200'
      },
      under_review: { 
        variant: 'default', 
        icon: Eye, 
        label: 'Under Review',
        className: 'bg-blue-100 text-blue-800 border-blue-200'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={`${config.className} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPurposeLabel = (purpose) => {
    const purposeLabels = {
      internship: 'Internship',
      study_abroad: 'Study Abroad',
      research_collaboration: 'Research Collaboration',
      external_project: 'External Project',
      conference_attendance: 'Conference Attendance',
      workshop_participation: 'Workshop Participation',
      other: 'Other'
    };
    return purposeLabels[purpose] || purpose;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { 
        variant: 'destructive', 
        label: 'High Priority',
        className: 'bg-red-100 text-red-800 border-red-200'
      },
      medium: { 
        variant: 'warning', 
        label: 'Medium Priority',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      low: { 
        variant: 'secondary', 
        label: 'Low Priority',
        className: 'bg-gray-100 text-gray-800 border-gray-200'
      }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <Badge variant="outline" className={`${config.className} border-0 text-xs`}>
        {config.label}
      </Badge>
    );
  };

  // Calculate stats
  const stats = {
    total: nocRequests.length,
    pending: nocRequests.filter(req => req.status === 'pending').length,
    approved: nocRequests.filter(req => req.status === 'approved').length,
    rejected: nocRequests.filter(req => req.status === 'rejected').length,
    underReview: nocRequests.filter(req => req.status === 'under_review').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
              <p className="text-gray-600 mb-4 break-words">{error}</p>
              <Button onClick={fetchNOCRequests} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your NOC requests and track their progress
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Link to="/create-noc" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create NOC Request</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Requests</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Under Review</p>
                  <p className="text-2xl font-bold">{stats.underReview}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts for managing your NOC requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/create-noc">
                  <Plus className="h-6 w-6" />
                  <span>Create New Request</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/dashboard">
                  <TrendingUp className="h-6 w-6" />
                  <span>View All Requests</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/profile">
                  <Building className="h-6 w-6" />
                  <span>Update Profile</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* NOC Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Your NOC Requests</span>
            </CardTitle>
            <CardDescription>
              Track the status of all your submitted NOC requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nocRequests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No NOC Requests Yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't submitted any NOC requests. Create your first request to get started.
                </p>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Link to="/create-noc" className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Your First NOC Request</span>
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {nocRequests.map((request) => (
                  <Card key={request._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 min-w-0" title={request.title}>
                            {request.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusBadge(request.status)}
                            {getPriorityBadge(request.priority)}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2" title={request.description}>
                        {request.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4" />
                            <span>{getPurposeLabel(request.purpose)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span>{request.department}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/noc/${request._id}`} className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </Link>
                          </Button>
                          
                          {request.status === 'approved' && (
                            <Button asChild variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                              <Link to={`/noc/${request._id}`} className="flex items-center space-x-1">
                                <Download className="h-4 w-4" />
                                <span>Certificate</span>
                              </Link>
                            </Button>
                          )}
                        </div>
                        
                        {request.reviewComments && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Review Comments:</p>
                            <p className="text-sm text-gray-700 max-w-xs truncate" title={request.reviewComments}>
                              {request.reviewComments}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;