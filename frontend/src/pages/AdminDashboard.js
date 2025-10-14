import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import {
  Settings,
  Users,
  FileText,
  TrendingUp,
  Filter,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Target,
  Calendar,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [nocRequests, setNocRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    page: 1
  });

  useEffect(() => {
    fetchNOCRequests();
    fetchStats();
    fetchAnalytics();
  }, [filters]);

  const fetchNOCRequests = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.department) params.append('department', filters.department);
      params.append('page', filters.page);
      params.append('limit', '10');

      const response = await axios.get(`/api/noc?${params}`);
      setNocRequests(response.data.nocRequests);
    } catch (error) {
      console.error('Error fetching NOC requests:', error);
      setError('Failed to load NOC requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/noc/stats/overview');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // For now, we'll generate analytics from the existing data
      // In a real app, you'd have a dedicated analytics endpoint
      const response = await axios.get('/api/noc');
      const allRequests = response.data.nocRequests;
      
      // Generate analytics data
      const analyticsData = generateAnalyticsData(allRequests);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const generateAnalyticsData = (requests) => {
    // Status distribution
    const statusData = [
      { name: 'Pending', value: requests.filter(r => r.status === 'pending').length, color: '#F59E0B' },
      { name: 'Approved', value: requests.filter(r => r.status === 'approved').length, color: '#10B981' },
      { name: 'Rejected', value: requests.filter(r => r.status === 'rejected').length, color: '#EF4444' },
      { name: 'Under Review', value: requests.filter(r => r.status === 'under_review').length, color: '#3B82F6' }
    ];

    // Department distribution
    const departmentCounts = {};
    requests.forEach(req => {
      departmentCounts[req.department] = (departmentCounts[req.department] || 0) + 1;
    });
    const departmentData = Object.entries(departmentCounts).map(([name, value]) => ({
      name,
      value,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

    // Purpose distribution
    const purposeCounts = {};
    requests.forEach(req => {
      purposeCounts[req.purpose] = (purposeCounts[req.purpose] || 0) + 1;
    });
    const purposeData = Object.entries(purposeCounts).map(([name, value]) => ({
      name: name.replace('_', ' ').toUpperCase(),
      value,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

    // Monthly trends (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthRequests = requests.filter(req => {
        const reqDate = new Date(req.createdAt);
        return reqDate.getMonth() === date.getMonth() && reqDate.getFullYear() === date.getFullYear();
      });
      
      monthlyData.push({
        month: monthName,
        requests: monthRequests.length,
        approved: monthRequests.filter(r => r.status === 'approved').length,
        pending: monthRequests.filter(r => r.status === 'pending').length
      });
    }

    return {
      statusData,
      departmentData,
      purposeData,
      monthlyData
    };
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
        label: 'High',
        className: 'bg-red-100 text-red-800 border-red-200'
      },
      medium: { 
        variant: 'warning', 
        label: 'Medium',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      low: { 
        variant: 'secondary', 
        label: 'Low',
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
              <Button onClick={() => window.location.reload()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
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
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <span>Admin Dashboard</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and monitor all NOC requests across the system
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center space-x-2"
              >
                {showAnalytics ? <BarChart3 className="h-4 w-4" /> : <PieChartIcon className="h-4 w-4" />}
                <span>{showAnalytics ? 'Hide' : 'Show'} Analytics</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setLoading(true);
                  fetchNOCRequests();
                  fetchStats();
                  fetchAnalytics();
                }}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Requests</p>
                    <p className="text-2xl font-bold">{stats.totalRequests}</p>
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
                    <p className="text-2xl font-bold">{stats.statusCounts.pending}</p>
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
                    <p className="text-2xl font-bold">{stats.statusCounts.approved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Recent (7 days)</p>
                    <p className="text-2xl font-bold">{stats.recentRequests}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Section */}
        {showAnalytics && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>Status Distribution</span>
                </CardTitle>
                <CardDescription>
                  Breakdown of NOC requests by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Department Distribution</span>
                </CardTitle>
                <CardDescription>
                  NOC requests by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Monthly Trends</span>
                </CardTitle>
                <CardDescription>
                  NOC request trends over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="requests" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Total Requests" />
                    <Area type="monotone" dataKey="approved" stackId="2" stroke="#10B981" fill="#10B981" name="Approved" />
                    <Area type="monotone" dataKey="pending" stackId="3" stroke="#F59E0B" fill="#F59E0B" name="Pending" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <select
                  id="status-filter"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="under_review">Under Review</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department-filter">Department</Label>
                <Input
                  id="department-filter"
                  placeholder="Filter by department"
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value, page: 1 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Actions</Label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ status: '', department: '', page: 1 })}
                    className="flex-1"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NOC Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>NOC Requests</span>
            </CardTitle>
            <CardDescription>
              Manage and review all submitted NOC requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nocRequests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No NOC Requests Found</h3>
                <p className="text-gray-600">
                  {filters.status || filters.department 
                    ? 'No requests match your current filters.' 
                    : 'No NOC requests have been submitted yet.'}
                </p>
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
                            <Users className="h-4 w-4" />
                            <span>{request.student?.name}</span>
                          </div>
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

export default AdminDashboard;