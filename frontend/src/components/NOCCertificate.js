import React, { forwardRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const NOCCertificate = forwardRef(({ nocRequest, student, purposeDetails }, ref) => {
  const { user } = useAuth();

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Purpose-specific content templates
  const getPurposeContent = (purpose) => {
    const templates = {
      internship: {
        title: "NO OBJECTION CERTIFICATE FOR INTERNSHIP",
        content: `This is to certify that ${student.name}, bearing Student ID: ${student.studentId || 'N/A'}, is a bonafide student of our institution pursuing ${student.department} program. We have no objection to the student undertaking an internship program as mentioned in their application.

The student has maintained good academic standing and conduct during their tenure at our institution. We recommend this student for the internship opportunity and believe they will represent our institution well.

This certificate is issued for the purpose of internship application and is valid for the academic year ${new Date().getFullYear()}-${new Date().getFullYear() + 1}.`
      },
      research_collaboration: {
        title: "NO OBJECTION CERTIFICATE FOR RESEARCH COLLABORATION",
        content: `This is to certify that ${student.name}, bearing Student ID: ${student.studentId || 'N/A'}, is a bonafide student of our institution pursuing ${student.department} program. We have no objection to the student participating in research collaboration activities as mentioned in their application.

The student has demonstrated excellent academic performance and research aptitude during their tenure at our institution. We fully support their participation in research collaboration and believe it will contribute to their academic growth and the advancement of knowledge.

This certificate is issued for the purpose of research collaboration and is valid for the academic year ${new Date().getFullYear()}-${new Date().getFullYear() + 1}.`
      },
      external_project: {
        title: "NO OBJECTION CERTIFICATE FOR EXTERNAL PROJECT",
        content: `This is to certify that ${student.name}, bearing Student ID: ${student.studentId || 'N/A'}, is a bonafide student of our institution pursuing ${student.department} program. We have no objection to the student participating in external project activities as mentioned in their application.

The student has shown commendable academic performance and practical skills during their tenure at our institution. We endorse their participation in external projects and believe it will enhance their learning experience and professional development.

This certificate is issued for the purpose of external project participation and is valid for the academic year ${new Date().getFullYear()}-${new Date().getFullYear() + 1}.`
      },
      conference_attendance: {
        title: "NO OBJECTION CERTIFICATE FOR CONFERENCE ATTENDANCE",
        content: `This is to certify that ${student.name}, bearing Student ID: ${student.studentId || 'N/A'}, is a bonafide student of our institution pursuing ${student.department} program. We have no objection to the student attending the conference as mentioned in their application.

The student has maintained excellent academic performance and active participation in academic activities during their tenure at our institution. We encourage their participation in conferences and believe it will contribute to their academic and professional growth.

This certificate is issued for the purpose of conference attendance and is valid for the academic year ${new Date().getFullYear()}-${new Date().getFullYear() + 1}.`
      },
      workshop_participation: {
        title: "NO OBJECTION CERTIFICATE FOR WORKSHOP PARTICIPATION",
        content: `This is to certify that ${student.name}, bearing Student ID: ${student.studentId || 'N/A'}, is a bonafide student of our institution pursuing ${student.department} program. We have no objection to the student participating in the workshop as mentioned in their application.

The student has demonstrated good academic standing and enthusiasm for learning during their tenure at our institution. We support their participation in workshops and believe it will enhance their skills and knowledge.

This certificate is issued for the purpose of workshop participation and is valid for the academic year ${new Date().getFullYear()}-${new Date().getFullYear() + 1}.`
      },
      other: {
        title: "NO OBJECTION CERTIFICATE",
        content: `This is to certify that ${student.name}, bearing Student ID: ${student.studentId || 'N/A'}, is a bonafide student of our institution pursuing ${student.department} program. We have no objection to the student's request as mentioned in their application.

The student has maintained good academic standing and conduct during their tenure at our institution. We support their request and believe it will contribute to their academic and personal development.

This certificate is issued for the purpose mentioned in the application and is valid for the academic year ${new Date().getFullYear()}-${new Date().getFullYear() + 1}.`
      }
    };

    return templates[purpose] || templates.other;
  };

  const purposeContent = getPurposeContent(nocRequest.purpose);

  return (
    <div ref={ref} className="bg-white p-12 max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* College Letterhead */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <div className="mb-4">
          {/* College Logo Placeholder */}
          <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">XYZ INSTITUTE OF TECHNOLOGY</h1>
        <h2 className="text-lg font-semibold text-gray-700 mb-1">Department of {student.department}</h2>
        <p className="text-sm text-gray-600"> Near WEH, Mumbai, Maharashtra - 400022</p>
        <p className="text-sm text-gray-600">Phone: +91-XXXXXXXXXX | Email: xyz@college.edu</p>
      </div>

      {/* Certificate Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{purposeContent.title}</h1>
        <p className="text-sm text-gray-600">Certificate No: NOC-{nocRequest._id.slice(-8).toUpperCase()}</p>
        <p className="text-sm text-gray-600">Date: {currentDate}</p>
      </div>

      {/* Certificate Content */}
      <div className="mb-8">
        <div className="text-justify leading-relaxed text-gray-800 space-y-4">
          {purposeContent.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Additional Details */}
        {nocRequest.description && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Additional Details:</h3>
            <p className="text-gray-700 text-justify">{nocRequest.description}</p>
          </div>
        )}
      </div>

      {/* Validity and Terms */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Terms and Conditions:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• This certificate is valid only for the academic year {new Date().getFullYear()}-{new Date().getFullYear() + 1}</li>
          <li>• The student must maintain good academic standing throughout the program</li>
          <li>• Any misconduct or violation of institutional policies will result in immediate withdrawal of this certificate</li>
          <li>• The student is responsible for all expenses related to the mentioned activity</li>
          <li>• This certificate does not guarantee acceptance by the external organization</li>
        </ul>
      </div>

      {/* Signatures */}
      <div className="mt-12">
        <div className="grid grid-cols-2 gap-8">
          {/* HOD Signature */}
          <div className="text-center">
            <div className="mb-4">
              <div className="w-32 h-16 mx-auto border-b-2 border-gray-400"></div>
            </div>
            <p className="font-semibold text-gray-900">Head of Department</p>
            <p className="text-sm text-gray-600">Department of {student.department}</p>
            <p className="text-sm text-gray-600">Date: {currentDate}</p>
          </div>

          {/* Principal Signature */}
          <div className="text-center">
            <div className="mb-4">
              <div className="w-32 h-16 mx-auto border-b-2 border-gray-400"></div>
            </div>
            <p className="font-semibold text-gray-900">Principal</p>
            <p className="text-sm text-gray-600">College Name</p>
            <p className="text-sm text-gray-600">Date: {currentDate}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center">
        <p className="text-xs text-gray-500">
          This is a computer-generated certificate. For verification, please contact the college administration.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Generated on: {new Date().toLocaleString()} | Generated by: {user?.name} ({user?.role})
        </p>
      </div>
    </div>
  );
});

NOCCertificate.displayName = 'NOCCertificate';

export default NOCCertificate;
