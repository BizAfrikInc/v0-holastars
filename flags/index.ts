import { flag } from 'flags/next';

export const joinWaitlistFlag = flag({
  key: 'waitlist',
  decide() {
    return process.env.NEXT_PUBLIC_JOIN_WAITLIST === 'true';
  },
});
