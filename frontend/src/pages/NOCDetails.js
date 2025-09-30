import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import CertificateGenerator from '../components/CertificateGenerator';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building, 
  Target, 
  Calendar, 
  User, 
  MessageSquare,
  FileImage,
  File,
  Award,
  AlertCircle,
  Save,
  RefreshCw
} from 'lucide-react';

const NOCDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [nocRequest, setNocRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState({});
  const [viewing, setViewing] = useState({});
  const [viewingModal, setViewingModal] = useState({ show: false, url: '', filename: '' });
  const [showCertificate, setShowCertificate] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    reviewComments: ''
  });

  useEffect(() => {
    fetchNOCRequest();
  }, [id]);

  const fetchNOCRequest = async () => {
    try {
      const response = await axios.get(`/api/noc/${id}`);
      setNocRequest(response.data.nocRequest);
      setUpdateData({
        status: response.data.nocRequest.status,
        reviewComments: response.data.nocRequest.reviewComments || ''
      });
    } catch (error) {
      console.error('Error fetching NOC request:', error);
      setError('Failed to load NOC request');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await axios.put(`/api/noc/update/${id}`, updateData);
      setNocRequest(response.data.nocRequest);
    } catch (error) {
      console.error('Error updating NOC request:', error);
      setError('Failed to update NOC request');
    } finally {
      setUpdating(false);
    }
  };

  const handleDownload = async (filename) => {
    setDownloading(prev => ({ ...prev, [filename]: true }));
    try {
      const response = await axios.get(`/api/noc/download/${filename}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download file');
    } finally {
      setDownloading(prev => ({ ...prev, [filename]: false }));
    }
  };

  const handleView = async (filename) => {
    setViewing(prev => ({ ...prev, [filename]: true }));
    try {
      const response = await axios.get(`/api/noc/view/${filename}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setViewingModal({ show: true, url, filename });
    } catch (error) {
      console.error('Error viewing file:', error);
      setError('Failed to view file');
    } finally {
      setViewing(prev => ({ ...prev, [filename]: false }));
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

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return <FileImage className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading NOC request details...</p>
        </div>
      </div>
    );
  }

  if (error || !nocRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading NOC Request</h3>
              <p className="text-gray-600 mb-4 break-words">{error || 'NOC request not found'}</p>
              <Button asChild variant="outline">
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{nocRequest.title}</h1>
                <p className="text-gray-600 mt-1">NOC Request Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(nocRequest.status)}
              {getPriorityBadge(nocRequest.priority)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Request Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{nocRequest.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Purpose</p>
                        <p className="font-medium text-gray-900">{getPurposeLabel(nocRequest.purpose)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium text-gray-900">{nocRequest.department}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="font-medium text-gray-900">
                          {new Date(nocRequest.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {nocRequest.updatedAt !== nocRequest.createdAt && (
                      <div className="flex items-center space-x-3">
                        <RefreshCw className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-medium text-gray-900">
                            {new Date(nocRequest.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Student Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{nocRequest.student?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{nocRequest.student?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="font-medium text-gray-900">{nocRequest.student?.studentId || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium text-gray-900">{nocRequest.student?.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attached Documents */}
            {nocRequest.attachments && nocRequest.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <File className="h-5 w-5" />
                    <span>Attached Documents</span>
                  </CardTitle>
                  <CardDescription>
                    Documents submitted with this NOC request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nocRequest.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(attachment.originalName)}
                          <div>
                            <p className="font-medium text-gray-900">{attachment.originalName}</p>
                            <p className="text-sm text-gray-500">
                              Uploaded on {new Date(attachment.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(attachment.filename)}
                            disabled={viewing[attachment.filename]}
                          >
                            {viewing[attachment.filename] ? (
                              <LoadingSpinner size="small" />
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(attachment.filename)}
                            disabled={downloading[attachment.filename]}
                          >
                            {downloading[attachment.filename] ? (
                              <LoadingSpinner size="small" />
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certificate Section */}
            {nocRequest.status === 'approved' && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <Award className="h-5 w-5" />
                    <span>NOC Certificate</span>
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Your NOC request has been approved. You can now generate and download your certificate.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowCertificate(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Generate Certificate
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Update (Admin/Faculty only) */}
            {(user?.role === 'admin' || user?.role === 'faculty') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Update Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStatusUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={updateData.status}
                        onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reviewComments">Review Comments</Label>
                      <textarea
                        id="reviewComments"
                        value={updateData.reviewComments}
                        onChange={(e) => setUpdateData({ ...updateData, reviewComments: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Add review comments..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={updating}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {updating ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="small" />
                          <span>Updating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Save className="h-4 w-4" />
                          <span>Update Status</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Review Information */}
            {nocRequest.reviewedBy && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Review Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Reviewed By</p>
                    <p className="font-medium text-gray-900">{nocRequest.reviewedBy?.name}</p>
                  </div>
                  {nocRequest.reviewedAt && (
                    <div>
                      <p className="text-sm text-gray-500">Reviewed On</p>
                      <p className="font-medium text-gray-900">
                        {new Date(nocRequest.reviewedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                  {nocRequest.reviewComments && (
                    <div>
                      <p className="text-sm text-gray-500">Review Comments</p>
                      <p className="font-medium text-gray-900">{nocRequest.reviewComments}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Document Viewing Modal */}
        {viewingModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Viewing: {viewingModal.filename}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewingModal({ show: false, url: '', filename: '' })}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6">
                <iframe
                  src={viewingModal.url}
                  className="w-full h-96 border border-gray-200 rounded"
                  title={viewingModal.filename}
                />
              </div>
            </div>
          </div>
        )}

        {/* Certificate Generator Modal */}
        {showCertificate && (
          <CertificateGenerator
            nocRequest={nocRequest}
            student={nocRequest.student}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </div>
    </div>
  );
};

export default NOCDetails;