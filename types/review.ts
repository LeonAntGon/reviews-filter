export interface ReviewFormData {
    name: string;
    email: string;
    opinion: string;
    rating: number;
  }
  
  export interface ReviewResponse {
    success: boolean;
    review?: any;
    message?: string;
    error?: string;
  }