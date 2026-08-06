# Snehil Verma — Portfolio Site

A multi-page portfolio site (Home, About, Workshops, Projects, Contact) served by a minimal Node/Express static server. The contact form sends real email via [Web3Forms](https://web3forms.com) — free, no backend secrets, no card required.

## Structure
```
portfolio-full/
├── public/              # frontend (served as static files)
│   ├── index.html         # Home
│   ├── about.html         # About (skills, education, certifications, leadership)
│   ├── workshops.html     # Workshops (training programs)
│   ├── projects.html      # Projects
│   ├── contact.html       # Contact (working form, submits directly to Web3Forms)
│   ├── 404.html
│   ├── resume/             # downloadable resume PDF
│   ├── css/style.css
│   └── js/main.js          # contains the Web3Forms access key
├── server.js              # minimal Express static server
├── package.json
└── README.md
```

## Setting up the contact form (one-time, ~2 minutes)
The form submits straight to Web3Forms from the browser — there's no backend email code to configure, but you do need your own access key so submissions land in *your* inbox.

1. Go to [web3forms.com](https://web3forms.com)
2. Enter your email (`snehilv2509@gmail.com`) and click **Create Access Key**
3. Check your inbox and verify the confirmation email
4. Copy the access key it gives you
5. Open `public/js/main.js`, find this line near the top of the contact form section:
   ```js
   const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE';
   ```
   Replace `YOUR_ACCESS_KEY_HERE` with your real key.
6. Save, then push the change (`git add .`, `git commit -m "add web3forms key"`, `git push`)

That's it — no environment variables, no Render dashboard configuration needed. The key is meant to be public/client-side visible by design (Web3Forms documents this) — it just routes submissions to your verified inbox, it isn't a secret credential.

**Free plan limits:** 250 submissions/month, 30-day submission history — more than enough for a portfolio site.

## Run it locally
```bash
npm install
npm start
```
Then open http://localhost:3000

## Deploying it live
Any Node host works (Render, Railway, etc.) — same as before:
1. Push this repo to GitHub
2. On Render: **New +** → **Web Service** → connect the repo
3. Build Command: `npm install`, Start Command: `npm start`, Instance: Free
4. No environment variables needed anymore (the Web3Forms key lives in `public/js/main.js`, not in server config)
5. Deploy, then visit your `.onrender.com` URL

## Notes
- The old SMTP/Brevo backend approach was removed — Render's free tier blocks outbound SMTP, and Brevo discontinued its free plan, so a client-side service (Web3Forms) is the most reliable free option for a low-volume contact form.
- All content is pulled directly from the resume — no placeholder or fictional content.
- Design uses `--bg` #030712, `--accent` #38bdf8, Inter + Syne typefaces, glass cards.
