import React, { useState } from "react";
import useFormStore from "@/store/useFormStore";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  approved: boolean;
  approvedAt?: Date;
  comment?: string;
  signature?: string;
}

interface TeamApprovalProps {
  onApprove: (reviewData: {
    memberId: string;
    comment: string;
    signature?: string;
  }) => void;
  currentUserId?: string;
}

export function TeamApproval({ onApprove, currentUserId }: TeamApprovalProps) {
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [signature, setSignature] = useState("");
  const [confirmRead, setConfirmRead] = useState(false);
  const { formData } = useFormStore();

  // Convert teammates from basic info to the format needed for team approval
  // In a real implementation, you would likely fetch this from the backend
  // This is a simulation for the example
  const teamMembers: TeamMember[] = (formData.basicInfo.teammates || []).map(
    (teammate, index) => ({
      id: index.toString(),
      name: teammate.name,
      role: "Team Member",
      approved: index % 3 === 0, // Simulate some approved members
      approvedAt: index % 3 === 0 ? new Date(Date.now() - Math.random() * 86400000) : undefined,
      comment: index % 3 === 0 ? "Looks good to me!" : undefined,
      signature: index % 3 === 0 ? teammate.name : undefined,
    })
  );

  // Add manager if available
  if (formData.basicInfo.managerName) {
    teamMembers.unshift({
      id: "manager",
      name: formData.basicInfo.managerName,
      role: "Manager",
      approved: true,
      approvedAt: new Date(Date.now() - 172800000), // 2 days ago
      comment: "Approved for team implementation",
      signature: formData.basicInfo.managerName,
    });
  }

  const handleApprove = () => {
    if (expandedMemberId && confirmRead) {
      onApprove({
        memberId: expandedMemberId,
        comment,
        signature,
      });
      setExpandedMemberId(null);
      setComment("");
      setSignature("");
      setConfirmRead(false);
    }
  };

  const currentUserApproved = teamMembers.find(
    (m) => m.id === currentUserId
  )?.approved;

  const approvedCount = teamMembers.filter((m) => m.approved).length;
  
  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const toggleMember = (memberId: string) => {
    if (expandedMemberId === memberId) {
      setExpandedMemberId(null);
    } else {
      setExpandedMemberId(memberId);
      // If the current user is expanding their own card and they haven't approved yet,
      // pre-fill their info
      if (memberId === currentUserId && !currentUserApproved) {
        const currentMember = teamMembers.find(m => m.id === currentUserId);
        if (currentMember) {
          setSignature(currentMember.name || "");
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with progress */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Team Approval</h3>
          <span className="text-sm text-gray-500">
            {approvedCount} of {teamMembers.length} approved
          </span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-300" 
            style={{width: `${(approvedCount / teamMembers.length) * 100}%`}}
          />
        </div>
      </div>

      {/* Team members list */}
      <div className="divide-y">
        {teamMembers.map((member) => (
          <div key={member.id} className="overflow-hidden">
            {/* Member header - always visible */}
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                expandedMemberId === member.id ? "bg-blue-50" : ""
              }`}
              onClick={() => toggleMember(member.id)}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-white ${
                    member.approved ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  {member.approved ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-lg font-medium">{member.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                {member.approved && (
                  <span className="text-xs text-green-600 mr-2">
                    Approved {formatDate(member.approvedAt)}
                  </span>
                )}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-400 transform transition-transform ${
                    expandedMemberId === member.id ? "rotate-180" : ""
                  }`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Expanded section */}
            {expandedMemberId === member.id && (
              <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                {member.approved ? (
                  <div className="space-y-3 pt-3">
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-sm font-medium mb-1">Comment:</p>
                      <p className="text-sm text-gray-600">{member.comment || "No comment provided"}</p>
                    </div>
                    
                    {member.signature && (
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-sm font-medium mb-1">Signature:</p>
                        <p className="text-sm italic text-gray-800">{member.signature}</p>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      Approved on {formatDate(member.approvedAt)}
                    </div>
                  </div>
                ) : (
                  <>
                    {member.id === currentUserId ? (
                      <div className="space-y-3 pt-3">
                        <input
                          type="text"
                          value={signature}
                          onChange={(e) => setSignature(e.target.value)}
                          className="w-full p-2 text-sm rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="Your signature"
                        />
                        
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="w-full p-2 text-sm rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          rows={2}
                          placeholder="Add optional comment"
                        />
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`confirm-${member.id}`}
                            checked={confirmRead}
                            onChange={(e) => setConfirmRead(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`confirm-${member.id}`} className="text-sm text-gray-700">
                            I confirm I&apos;ve reviewed this report
                          </label>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setExpandedMemberId(null)}
                            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleApprove}
                            disabled={!confirmRead || !signature}
                            className={`px-4 py-2 text-sm rounded text-white ${
                              confirmRead && signature
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-3 text-sm text-gray-500">
                        Pending approval from {member.name}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}