> **How to use this template**
> Fill in `[CANDIDATE NAME]`, `[YOUR NAME]`, and `[DEADLINE DATE]`, then paste into your email client.
> Attach the file: `docker-compose.yml` (found in the root of this repository).

---

**Subject:** HES Technical Interview – Environment Setup Instructions

---

Hi [CANDIDATE NAME],

Thank you for your interest in the position. To complete the technical interview, you will need to run a small web application on your computer.

**The only prerequisite is Docker Desktop** — no coding tools, no database clients, nothing else.

---

**Step 1 – Install Docker Desktop**

Download and install Docker Desktop for your operating system:
https://www.docker.com/products/docker-desktop/

Once installed, open Docker Desktop and make sure it is running (you will see the Docker whale icon in your system tray / menu bar).

---

**Step 2 – Save the attached file**

Save the attached `docker-compose.yml` file to any folder on your computer (e.g. your Desktop or Downloads folder).

---

**Step 3 – Open a terminal in that folder**

- **Windows**: right-click the folder → _Open in Terminal_ (or open PowerShell and `cd` to the folder)
- **macOS / Linux**: right-click the folder → _New Terminal at Folder_ (or open Terminal and `cd` to the folder)

---

**Step 4 – Run one command**

```
docker compose up -d
```

The first run will take **2–3 minutes** while Docker downloads and builds everything.
You will know it is ready when the command prompt returns.

---

**Step 5 – Open the application**

Once the command finishes, open these URLs in your browser:

| Service                    | URL                   | Credentials                                  |
| -------------------------- | --------------------- | -------------------------------------------- |
| Application                | http://localhost:3000 | _(register a new account)_                   |
| API Docs (Swagger)         | http://localhost:5051 | _(no login)_                                 |
| Database Admin (pgAdmin 4) | http://localhost:5050 | email: `admin@admin.com` / password: `admin` |

---

**Stopping the environment**

When you are done for the day, run:

```
docker compose down
```

To start it again later, repeat Step 4.

---

**Troubleshooting**

- Make sure Docker Desktop is open and running before executing the command.
- If port 3000, 5050, or 8080 is already in use, quit the application occupying that port and try again.
- If you see any errors, please reply to this email with a screenshot and we will help you promptly.

---

Please have the environment set up and ready before **[DEADLINE DATE]**.

If you have any questions, don't hesitate to reach out.

Good luck, and we look forward to seeing your work!

Best regards,
[YOUR NAME]
