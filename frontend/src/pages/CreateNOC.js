import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  FileText, 
  Upload, 
  X, 
  Check, 
  AlertCircle,
  Building,
  Target,
  FileImage,
  File,
  Plus,
  Info
} from 'lucide-react';

const CreateNOC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    purpose: '',
    department: '',
    documents: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validate required documents
  const validateDocuments = () => {
    const compulsoryDocs = ['student_id_card', 'fee_receipt'];
    
    // Check compulsory documents
    for (const docType of compulsoryDocs) {
      if (!formData.documents.some(doc => doc.type === docType)) {
        const docName = docType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        setError(`Please upload ${docName} document`);
        return false;
      }
    }

    // Check purpose-specific required documents
    if (formData.purpose) {
      const purposeDocs = getPurposeDocuments(formData.purpose);
      const requiredPurposeDocs = purposeDocs.filter(doc => doc.required);
      
      for (const doc of requiredPurposeDocs) {
        if (!formData.documents.some(uploadedDoc => uploadedDoc.type === doc.key)) {
          setError(`Please upload ${doc.label} document`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate documents
    if (!validateDocuments()) {
      setLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('purpose', formData.purpose);
      submitData.append('department', formData.department);

      // Debug: Log documents being sent
      console.log('Documents being sent:', formData.documents);

      // Append documents - backend expects files directly under 'documents' field
      formData.documents.forEach((doc) => {
        submitData.append('documents', doc.file);
      });

      await axios.post('/api/noc/create', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating NOC request:', error);
      setError(error.response?.data?.message || 'Failed to create NOC request');
    } finally {
      setLoading(false);
    }
  };

  const purposeOptions = [
    { value: 'internship', label: 'Internship', icon: '💼' },
    { value: 'research_collaboration', label: 'Research Collaboration', icon: '🔬' },
    { value: 'external_project', label: 'External Project', icon: '🚀' },
    { value: 'conference_attendance', label: 'Conference Attendance', icon: '🎤' },
    { value: 'workshop_participation', label: 'Workshop Participation', icon: '🛠️' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];

  const getPurposeDocuments = (purpose) => {
    const documentTypes = {
      internship: [
        { key: 'offer_letter', label: 'Offer Letter', required: true },
        { key: 'company_details', label: 'Company Details', required: false }
      ],
      research_collaboration: [
        { key: 'research_proposal', label: 'Research Proposal', required: true },
        { key: 'collaboration_agreement', label: 'Collaboration Agreement', required: false }
      ],
      external_project: [
        { key: 'project_proposal', label: 'Project Proposal', required: true },
        { key: 'client_details', label: 'Client Details', required: false }
      ],
      conference_attendance: [
        { key: 'conference_invitation', label: 'Conference Invitation', required: true },
        { key: 'abstract', label: 'Abstract/Paper', required: false }
      ],
      workshop_participation: [
        { key: 'workshop_details', label: 'Workshop Details', required: true },
        { key: 'registration_proof', label: 'Registration Proof', required: false }
      ],
      other: [
        { key: 'supporting_documents', label: 'Supporting Documents', required: false }
      ]
    };

    return documentTypes[purpose] || [];
  };

  const handleDocumentUpload = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload only image files (JPEG, PNG, GIF) or PDF files');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Remove existing document of same type
    const updatedDocuments = formData.documents.filter(doc => doc.type !== docType);
    
    // Add new document
    updatedDocuments.push({
      type: docType,
      name: file.name,
      file: file,
      size: file.size
    });

    setFormData({
      ...formData,
      documents: updatedDocuments
    });
    setError('');
  };

  const removeDocument = (docType) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter(doc => doc.type !== docType)
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return <FileImage className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
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
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create NOC Request</h1>
              <p className="text-gray-600 mt-1">Submit a new No Objection Certificate request</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Provide the essential details for your NOC request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Request Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter a descriptive title for your request"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                    Department *
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="department"
                      name="department"
                      type="text"
                      required
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your department"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose" className="text-sm font-medium text-gray-700">
                  Purpose *
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {purposeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, purpose: option.value })}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                        formData.purpose === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description *
                </Label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Provide a detailed description of your request..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Required Documents</span>
              </CardTitle>
              <CardDescription>
                Upload the necessary documents for your NOC request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Compulsory Documents */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <h3 className="text-sm font-medium text-gray-900">Compulsory Documents</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'student_id_card', label: 'Student ID Card', description: 'Upload a clear photo or scan of your student ID card' },
                    { key: 'fee_receipt', label: 'Fee Receipt', description: 'Upload your latest fee receipt or payment proof' }
                  ].map((doc) => (
                    <div key={doc.key} className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        {doc.label} *
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          id={doc.key}
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentUpload(e, doc.key)}
                          className="hidden"
                        />
                        <label
                          htmlFor={doc.key}
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <Upload className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-600">Click to upload</span>
                          <span className="text-xs text-gray-500 text-center">{doc.description}</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purpose-specific Documents */}
              {formData.purpose && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <h3 className="text-sm font-medium text-gray-900">
                      {purposeOptions.find(p => p.value === formData.purpose)?.label} Documents
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getPurposeDocuments(formData.purpose).map((doc) => (
                      <div key={doc.key} className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          {doc.label} {doc.required && '*'}
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                          <input
                            type="file"
                            id={doc.key}
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocumentUpload(e, doc.key)}
                            className="hidden"
                          />
                          <label
                            htmlFor={doc.key}
                            className="cursor-pointer flex flex-col items-center space-y-2"
                          >
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="text-sm text-gray-600">Click to upload</span>
                            {doc.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Documents */}
              {formData.documents.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Uploaded Documents</h3>
                  <div className="space-y-2">
                    {formData.documents.map((doc) => (
                      <div key={doc.type} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Check className="h-4 w-4 text-green-600" />
                          <div className="flex items-center space-x-2">
                            {getFileIcon(doc.name)}
                            <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                            {formatFileSize(doc.size)}
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(doc.type)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Guidelines */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-blue-900">Document Guidelines</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Supported formats: JPEG, PNG, GIF, PDF</li>
                        <li>• Maximum file size: 5MB per document</li>
                        <li>• Ensure documents are clear and readable</li>
                        <li>• All required documents must be uploaded before submission</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm break-words">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="small" />
                  <span>Creating Request...</span>
                </div>
              ) : (
                'Create NOC Request'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNOC;