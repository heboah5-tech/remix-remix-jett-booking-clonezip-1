<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# JETT Booking

A React and Express booking experience for JETT bus services.

## Run on Replit

The registered artifact workflows run the frontend and API independently:

- `pnpm --filter @workspace/jett-booking run dev`
- `pnpm --filter @workspace/api-server run dev`

Install dependencies with `pnpm install`, then use the Replit workflow controls.
The API reads `SUPABASE_URL` and either `SUPABASE_SERVICE_ROLE_KEY` or
`SUPABASE_ANON_KEY` for persistent booking and tracking data.
