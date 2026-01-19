import * as React from 'react';


interface EmailTemplateProps {
    firstName: string;
  }
  
  export function EmailTemplate({ firstName }: EmailTemplateProps) {
    return (
      <div>
        <h3>Hello, {firstName}!</h3>
        <p>Thank you for submitting your talk to the Gophers Conference 2026. We will review your talk and get back to you soon.</p>
        <p>Best regards,</p>
        <p>The Gophers Conference Team.</p>
        <p>Gophers Conference 2026</p>
      </div>
    );
  }