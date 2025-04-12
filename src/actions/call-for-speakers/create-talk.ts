'use server';

import { getSession, HttpApiResponse } from "..";
import { API_BASE_URL } from '../index';
import { z } from "zod";
import { revalidatePath } from "next/cache";
import paths from "@/src/path";
import { UpdateReservationStatus } from "@/src/types/talk";



export interface UpdateReservationFormState {
    error: {
        _form?: string[];
        status?: string[];
        restaurant_table_id?: string[];
        business_id?: string[];
    };
}

function updateTableReservationSchema() {
    return z.object({
        status: z.string().min(1),
        restaurant_table_id: z.string().min(1),
        business_id: z.string().min(1),
    });
}

export async function updateTableReservation(bookingId: string, formState: UpdateReservationFormState, formData: FormData): Promise<UpdateReservationFormState> {  
    const validationResult = updateTableReservationSchema().safeParse({
        status: formData.get("status"),
        restaurant_table_id: formData.get("restaurant_table_id"),
        business_id: formData.get("business_id"),
    });

    if (!validationResult.success) {
        const error = validationResult.error.flatten().fieldErrors as UpdateReservationFormState["error"];
        return { error: error };
    }

    const { status, restaurant_table_id, business_id } = validationResult.data;

    try {
        const result: HttpApiResponse = await updateReservation(bookingId, {
            status: status as string,
            restaurant_table_id: restaurant_table_id as string,
            business_id: business_id as string,
        });

        if (result.status >= 400 && result.status <= 500) {
            return { error: { _form: [result.error] } as UpdateReservationFormState["error"] };
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: { _form: [error.message] } as UpdateReservationFormState["error"] };
        } else {
            return { error: { _form: ["An unknown error occurred"] } as UpdateReservationFormState["error"] };
        }
    }

    // invalidate cache
    revalidatePath(paths.reservationShow(bookingId));
    return { error: {} };
}




export async function createTalk(data: CreateTalkStatus): Promise<HttpApiResponse> {
    const { account_id, token } = await getSession();
    const response = await fetch(`${API_BASE_URL}/talks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        cache: 'no-store',
    });

    const result: HttpApiResponse = await response.json();
    return result;
}