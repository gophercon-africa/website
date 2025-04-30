"use server";

import { z } from 'zod';
import { prisma } from '@/src/lib/prisma';

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

/**
 * Subscribe to the newsletter
 * @param formData Form data containing the email address
 * @returns Result of the subscription attempt
 */
export async function subscribeToNewsletter(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    
    const validatedData = newsletterSchema.parse({ email });
    
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: validatedData.email },
    });
    
    if (existingSubscriber) {
      if (!existingSubscriber.active) {
        await prisma.newsletterSubscriber.update({
          where: { id: existingSubscriber.id },
          data: { active: true }
        });
        return { success: true, message: "Your subscription has been reactivated" };
      }
      
      return { success: false, message: "This email is already subscribed" };
    }
    
    await prisma.newsletterSubscriber.create({
      data: {
        email: validatedData.email,
        active: true
      }
    });
    
    return { success: true, message: "Successfully subscribed to the newsletter" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    
    console.error('Newsletter subscription error:', error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

/**
 * Unsubscribe from the newsletter
 * @param email Email address to unsubscribe
 * @returns Result of the unsubscription attempt
 */
export async function unsubscribeFromNewsletter(email: string) {
  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });
    
    if (!subscriber) {
      return { success: false, message: "Email not found in our subscribers list" };
    }
    
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { active: false }
    });
    
    return { success: true, message: "Successfully unsubscribed from the newsletter" };
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    return { success: false, message: "An unexpected error occurred" };
  }
}