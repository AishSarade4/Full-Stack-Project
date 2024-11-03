export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    kycStatus: 'pending' | 'approved' | 'rejected';
    documentsStatus: 'pending' | 'approved' | 'rejected';
    policyStatus: 'pending' | 'approved' | 'rejected';
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface Document {
    id: string;
    type: 'id_proof' | 'address_proof' | 'medical_report' | 'financial_record';
    status: 'pending' | 'approved' | 'rejected';
    url: string;
    createdAt: Date;
    updatedAt: Date;
  }