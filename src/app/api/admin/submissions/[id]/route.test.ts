import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/src/db';
import { PATCH } from './route';

vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}));

vi.mock('@/src/db', () => ({
  db: {
    talk: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const mockedGetToken = vi.mocked(getToken);
const mockedFindFirst = vi.mocked(db.talk.findFirst);
const mockedUpdate = vi.mocked(db.talk.update);

const TALK_ID = 'talk-1';

function patchRequest(body: unknown) {
  const request = new NextRequest(`http://localhost/api/admin/submissions/${TALK_ID}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return PATCH(request, { params: Promise.resolve({ id: TALK_ID }) });
}

function asAdmin() {
  mockedGetToken.mockResolvedValue({ email: 'admin@example.com', role: 'admin' } as never);
}

beforeEach(() => {
  vi.resetAllMocks();
  mockedFindFirst.mockResolvedValue({ id: TALK_ID } as never);
  mockedUpdate.mockImplementation((async ({ data }: { data: object }) => ({
    id: TALK_ID,
    ...data,
  })) as never);
});

describe('PATCH /api/admin/submissions/[id] — change category', () => {
  it('rejects unauthenticated requests', async () => {
    mockedGetToken.mockResolvedValue(null);

    const res = await patchRequest({ talkCategory: 'AI' });

    expect(res.status).toBe(401);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('rejects non-admin users', async () => {
    mockedGetToken.mockResolvedValue({ email: 'reviewer@example.com', role: 'reviewer' } as never);

    const res = await patchRequest({ talkCategory: 'AI' });

    expect(res.status).toBe(403);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('updates only the category, leaving decision fields untouched', async () => {
    asAdmin();

    const res = await patchRequest({ talkCategory: 'Security' });

    expect(res.status).toBe(200);
    expect(mockedUpdate).toHaveBeenCalledWith({
      where: { id: TALK_ID },
      data: { talkCategory: 'Security' },
    });
    await expect(res.json()).resolves.toMatchObject({
      success: true,
      talk: { talkCategory: 'Security' },
    });
  });

  it('rejects a category outside the canonical list', async () => {
    asAdmin();

    const res = await patchRequest({ talkCategory: 'Blockchain' });

    expect(res.status).toBe(400);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('rejects a body with neither status nor talkCategory', async () => {
    asAdmin();

    const res = await patchRequest({ decisionNotes: 'just notes' });

    expect(res.status).toBe(400);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('returns 404 when the talk is not in the current event year', async () => {
    asAdmin();
    mockedFindFirst.mockResolvedValue(null);

    const res = await patchRequest({ talkCategory: 'AI' });

    expect(res.status).toBe(404);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('still saves a decision (status + notes + booleans) as before', async () => {
    asAdmin();

    const res = await patchRequest({ status: 'accepted', decisionNotes: 'great talk' });

    expect(res.status).toBe(200);
    expect(mockedUpdate).toHaveBeenCalledWith({
      where: { id: TALK_ID },
      data: {
        status: 'accepted',
        IsPendingReview: false,
        IsAccepted: true,
        decisionNotes: 'great talk',
      },
    });
  });

  it('changes category and status together in one request', async () => {
    asAdmin();

    const res = await patchRequest({ status: 'shortlisted', talkCategory: 'API' });

    expect(res.status).toBe(200);
    expect(mockedUpdate).toHaveBeenCalledWith({
      where: { id: TALK_ID },
      data: {
        status: 'shortlisted',
        IsPendingReview: true,
        IsAccepted: false,
        decisionNotes: null,
        talkCategory: 'API',
      },
    });
  });
});
