# Project Notes & Submission Details

## Fairness & Anti-Abuse (Success Criteria #4)

I implemented two primary mechanisms to ensure fairness:

### 1. Server-Side IP Validation
- **What it prevents**: Prevents multiple votes from the same device/network within a single poll.
- **How it works**: When a vote is submitted, the server extracts the `x-forwarded-for` header or the remote address. It checks the `votes` collection in MongoDB for any entry with the same `pollId` and `ip`.
- **Known Limitations**: Users on a shared network (like an office or school) might be blocked if someone else has already voted. Also, VPNs can be used to rotate IPs.

### 2. Client-Side Browser Fingerprinting
- **What it prevents**: Prevents voting from different "sessions" (like incognito mode) on the same machine/browser.
- **How it works**: A unique hash is generated from non-sensitive browser properties: `userAgent`, `language`, `screenResolution`, `timezoneOffset`, and `hardwareConcurrency`. This fingerprint is sent with the vote and stored in the database.
- **Known Limitations**: Browser fingerprints can occasionally change after browser updates or if settings are significantly modified.

## Real-Time Implementation (Success Criteria #3)

- **Approach**: I used a **Polling Strategy** (every 3 seconds).
- **Reasoning**: In a serverless/Next.js environment, standard long-running WebSockets (Socket.io) often require a dedicated server (Node.js/Express) which complicates deployment to platforms like Vercel. Polling provides a robust, "works everywhere" solution that still feels "real-time" to the end user without the overhead of specialized infrastructure.

## Persistence (Success Criteria #5)

- **Database**: MongoDB Atlas.
- **Schema**:
  - `polls`: Stores questions, options, and current vote counts.
  - `votes`: Stores historical vote records (pollId, optionId, IP, fingerprint) for validation.
- **Reliability**: Once a vote is cast, it's immediately incremented in the poll document and a record is created in the votes collection using an atomic database operation.

## Edge Cases Handled
- URL tampering (detecting invalid/non-existent poll IDs).
- Mobile keyboard layout shifts during poll creation.
- Copy-to-clipboard feedback on mobile devices.
- Concurrent voting (using MongoDB `$inc` to prevent race conditions).
