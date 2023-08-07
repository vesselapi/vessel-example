# Vessel API Demo
_Build Integrations in Minutes_

## Getting Started

First update the `.env` file and include your Vessel API Token
```
VESSEL_API_TOKEN=<your api token>
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

All API requests are put into the `pages/api` directory. You can read more about the Next.js API routes [here](https://nextjs.org/docs/api-routes/introduction).

We are using the Vessel API SDK to make requests to the Vessel API. You can read more about the API [here](https://docs.vessel.dev/pages/home/getting-started)

## Live Demo
To see a live demo that uses a similar structure, check out [Sales Viz](https://sales-viz.vercel.app/)
