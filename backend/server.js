
import express from "express"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import cors from "cors"
import { google } from "googleapis";
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"
import session from "express-session"; 
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js"



const PORT = process.env.PORT || 5000



dotenv.config()

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
   "http://localhost:5000/auth/google/callback"
);

app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // Allow cookies and authorization headers
  }));


app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret", // Must be set in .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // secure: true in production
  })
);

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)



// app.get("/",(req,res) => {
//     //root route http://localhost:5000/
//     res.send("Hello World")
// })

app.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // Ensures a refresh token is provided
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/meetings.space.created",
    ],
    prompt: "consent", // Forces refresh token on first login
  });
  res.redirect(url);
});

app.get("/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    req.session.tokens = tokens; // Store tokens in session
    console.log("Tokens stored:", tokens);
    res.redirect("http://localhost:3000"); // Redirect to frontend after auth
  } catch (error) {
    console.error("Error in Google OAuth callback:", error);
    res.status(500).send("Authentication failed");
  }
});

// Google Meet Creation Endpoint
app.post("/api/create-meeting", async (req, res) => {
  try {
    if (!req.session.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    oauth2Client.setCredentials(req.session.tokens);

    // Refresh token if expired
    if (req.session.tokens.expiry_date < Date.now()) {
      const { credentials } = await oauth2Client.refreshAccessToken();
      req.session.tokens = credentials;
      console.log("Refreshed tokens:", credentials);
    }

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: "Chat App Meeting",
      description: "Meeting created from MERN Chat App",
      start: {
        dateTime: new Date().toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
        timeZone: "UTC",
      },
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}`, // Unique ID for the request
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetLink = response.data.hangoutLink;
    res.json({ meetLink });
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({ error: "Failed to create meeting" });
  }
});


server.listen(PORT,() => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`)
}); 