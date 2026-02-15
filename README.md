# Real-Time Polling Application

A modern, fast, and secure web application to create polls and collect votes with real-time result updates.

## Features

- **Instant Poll Creation**: Create a poll with a question and multiple options in seconds.
- **Real-Time Results**: Results update automatically without manual page refreshes.
- **Anti-Abuse Protection**: Multi-layer security to prevent double voting.
- **Mobile Responsive**: Fully optimized for all screen sizes with a premium glassmorphism design.
- **Persistence**: All polls and votes are stored securely in MongoDB Atlas.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Real-Time**: State-based Polling Strategy

## Anti-Abuse Mechanisms

1. **IP-Based Rate Limiting**: The server extracts the voter's IP address and ensures that only one vote can be cast per IP per poll.
2. **Browser Fingerprinting**: A unique fingerprint is generated on the client side based on browser characteristics (User Agent, timezone, hardware concurrency, etc.). This prevents users from clearing cookies or using incognito mode to vote again.

## Edge Cases Handled

- **Empty Options**: Polls cannot be created with fewer than 2 non-empty options.
- **Already Voted State**: Detects if a user has already voted and shows results immediately instead of the voting form.
- **Network Resilience**: Real-time updates continue to poll gracefully even if there's a temporary network hiccup.
- **Unique IDs**: Uses `nanoid` for short, shareable, and collision-resistant poll links.

## Known Limitations & Improvements

- **VPN Bypass**: Determined users can bypass IP checks using a VPN.
- **Fingerprint Spoofing**: Advanced users can spoof browser characteristics.
- **Future Improvement**: Implement full WebSockets (Socket.io) for even lower latency and higher scale.
- **Future Improvement**: Add social login (Google/GitHub) for 100% verified voting.

## Setup Instructions

1. **Clone the repository**.
2. **Install dependencies**: `npm install`.
3. **Set up `.env`**: Add your `MONGODB_URI`.
4. **Run development server**: `npm run dev`.