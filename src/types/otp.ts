export interface OtpFormState {
  errors?: {
    email?: string[];
    otp?: string[];
    _form?: string[];
  };
  success?: boolean;
  redirectTo?: string;
}

export interface OtpSendRequest {
  email: string;
}

export interface OtpVerifyRequest {
  email: string;
  otp: string;
}
