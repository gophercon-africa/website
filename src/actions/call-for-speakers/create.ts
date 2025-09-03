'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import db from "@/src/db";
import paths from "@/src/path";
import { Resend } from "resend";
import { EmailTemplate } from "@/src/notification/email/templates/talk-submission-success";
    
const createTalkSchema = z.object({
    fullName: z.string().min(3, { message: "Full name must be at least 3 characters long" }),
    email: z.string().min(10, { message: "Email must be at least 10 characters long" }).email({ message: "Invalid email address" }),
    company: z.string().min(3, { message: "Company must be at least 3 characters long" }),
    phone: z.string().min(10, { message: "Phone must be at least 10 characters long" }),
    title: z.string().min(2, { message: "Title must be at least 2 characters long" }),
    bio: z.string().min(50, { message: "Bio must be at least 50 characters long" }),
    talkTitle: z.string().min(3, { message: "Talk title must be at least 3 characters long" }),
    talkDescription: z.string().min(50, { message: "Talk description must be at least 50 characters long" }),
    talkDuration: z.string().min(1, { message: "Talk duration must be at least 1 character long" }) ,
    talkLevel: z.string().min(1, { message: "Talk level must be at least 1 character long" }),
    previousSpeakingExperience: z.string().min(1, { message: "Previous speaking experience must be at least 1 character long" }),
    additionalNotes: z.string().min(1, { message: "Additional notes must be at least 1 character long" }),
    eventYear: z.string().min(4, { message: "Event year must be at least 4 characters long" }),
});

export interface TalkFormState {
    errors: {
        _form?: string[];
        fullName?: string[];
        email?: string[];
        phone?: string[];
        company?: string[];
        title?: string[];
        bio?: string[];
        talkTitle?: string[];
        talkDescription?: string[];
        talkDuration?: string[];
        talkLevel?: string[];
        previousSpeakingExperience?: string[];
        additionalNotes?: string[];
        eventYear?: string[];
        IsAccepted?: string[];
        IsPendingReview?: string[];
    };
}

export async function createTalk(formState: TalkFormState, formData: FormData): Promise<TalkFormState> {
 
        // Check if user's email address is already in the database
        const user = await db.talk.findMany({
            where: {
                email: formData.get('email') as string
            }
        });
        // Check if user has already submitted a talk twice
        if (user.length >= 2) {
            return { errors: { email: ['You have already submitted two talks. Please wait for the previous talks to be reviewed.'] } };
        }


    const validatedFields = createTalkSchema.safeParse({
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        title: formData.get('title'),
        bio: formData.get('bio'),
        talkTitle: formData.get('talkTitle'),
        talkDescription: formData.get('talkDescription'),
        talkDuration: formData.get('talkDuration'),
        talkLevel: formData.get('talkLevel'),
        previousSpeakingExperience: formData.get('previousSpeakingExperience'),
        additionalNotes: formData.get('additionalNotes'),
        eventYear: formData.get('eventYear'),
        IsAccepted: formData.get('IsAccepted') === 'true',
        IsPendingReview: formData.get('IsPendingReview') === 'true',
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }
    try {
        await db.talk.create({
            data: {
                ...validatedFields.data,
                IsAccepted: false,
                IsPendingReview: true,
            }
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return {
                errors: {
                    _form: [err.message],
                    fullName: [err.message],
                    email: [err.message],
                    phone: [err.message],
                    company: [err.message],
                    title: [err.message],
                    bio: [err.message],
                    talkTitle: [err.message],
                    talkDescription: [err.message],
                    talkDuration: [err.message],
                    talkLevel: [err.message],
                    previousSpeakingExperience: [err.message],
                    additionalNotes: [err.message],
                    eventYear: [err.message],
                    IsAccepted: [err.message],
                    IsPendingReview: [err.message],
                },
            };
        } else {
            return {
                errors: {
                    _form: ["Failed to submit talk"],
                },
            };
        }
    }

    // Send email to the user using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
        from: "hello@gophercon.africa",
        replyTo: "hello@gophers.africa",
        to:  validatedFields.data.email,
        subject: 'Thank you for submitting your talk to the Gophers Conference 2025',
        react: EmailTemplate({ firstName: validatedFields.data.fullName })
    });

    if (error) {
        console.error(error);
        return { errors: { email: ['Failed to send email'] } };
    }

    revalidatePath(paths.callForSpeakers());
    return { errors: {} };
}
