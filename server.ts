import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import multer from "multer";
import path from "path";
import fs from "fs";

const db = new Database("animesek.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    avatar TEXT,
    xp INTEGER DEFAULT 0,
    rank TEXT DEFAULT 'Rookie Otaku',
    bio TEXT
  );

  CREATE TABLE IF NOT EXISTS anime (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    poster TEXT,
    genre TEXT,
    rating REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    animeId TEXT,
    category TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    type TEXT, -- 'image' or 'video'
    url TEXT,
    caption TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room TEXT,
    userId TEXT,
    username TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed some anime data if empty
const animeCount = db.prepare("SELECT COUNT(*) as count FROM anime").get() as { count: number };
if (animeCount.count <= 4) {
  const popularAnime = [
    ["One Piece", "Adventure/Fantasy"], ["Naruto", "Action/Adventure"], ["Dragon Ball Z", "Action/Sci-Fi"],
    ["Death Note", "Psychological/Thriller"], ["Fullmetal Alchemist", "Adventure/Fantasy"], ["Steins;Gate", "Sci-Fi/Thriller"],
    ["Hunter x Hunter", "Action/Adventure"], ["Code Geass", "Mecha/Drama"], ["One Punch Man", "Action/Comedy"],
    ["My Hero Academia", "Action/Superhero"], ["Demon Slayer", "Action/Fantasy"], ["Jujutsu Kaisen", "Action/Supernatural"],
    ["Tokyo Ghoul", "Dark Fantasy/Horror"], ["Sword Art Online", "Action/Adventure"], ["No Game No Life", "Fantasy/Comedy"],
    ["Re:Zero", "Fantasy/Drama"], ["Konosuba", "Fantasy/Comedy"], ["Your Name", "Romance/Fantasy"],
    ["A Silent Voice", "Drama/Slice of Life"], ["Cowboy Bebop", "Sci-Fi/Action"], ["Samurai Champloo", "Action/Adventure"],
    ["Mob Psycho 100", "Action/Comedy"], ["Vinland Saga", "Action/Adventure"], ["Dr. Stone", "Sci-Fi/Adventure"],
    ["Fire Force", "Action/Sci-Fi"], ["Black Clover", "Action/Fantasy"], ["Bleach", "Action/Adventure"],
    ["Fairy Tail", "Action/Adventure"], ["Gintama", "Action/Comedy"], ["Haikyuu", "Sports/Drama"],
    ["Kuroko no Basket", "Sports/Drama"], ["Blue Lock", "Sports/Drama"], ["Chainsaw Man", "Action/Horror"],
    ["Spy x Family", "Action/Comedy"], ["Kaguya-sama", "Romance/Comedy"], ["Oshi no Ko", "Drama/Supernatural"],
    ["Frieren", "Fantasy/Adventure"], ["Solo Leveling", "Action/Fantasy"], ["Hell's Paradise", "Action/Fantasy"],
    ["Mushoku Tensei", "Fantasy/Adventure"], ["Overlord", "Fantasy/Action"], ["Slime Isekai", "Fantasy/Adventure"],
    ["Shield Hero", "Fantasy/Action"], ["Goblin Slayer", "Fantasy/Action"], ["Made in Abyss", "Fantasy/Adventure"],
    ["Promised Neverland", "Mystery/Thriller"], ["Erased", "Mystery/Thriller"], ["Parasyte", "Action/Horror"],
    ["Psycho-Pass", "Sci-Fi/Thriller"], ["Fate/Zero", "Action/Fantasy"], ["Fate/stay night", "Action/Fantasy"],
    ["Monogatari", "Supernatural/Mystery"], ["Madoka Magica", "Psychological/Drama"], ["Kill la Kill", "Action/Comedy"],
    ["Gurren Lagann", "Mecha/Action"], ["Darling in the Franxx", "Mecha/Romance"], ["Akira", "Sci-Fi/Action"],
    ["Ghost in the Shell", "Sci-Fi/Action"], ["Perfect Blue", "Psychological/Thriller"], ["Paprika", "Sci-Fi/Thriller"],
    ["Your Lie in April", "Drama/Music"], ["Anohana", "Drama/Slice of Life"], ["Clannad", "Drama/Romance"],
    ["Angel Beats", "Drama/Fantasy"], ["Violet Evergarden", "Drama/Fantasy"], ["March Comes in Like a Lion", "Drama/Slice of Life"],
    ["Fruits Basket", "Drama/Romance"], ["Horimiya", "Romance/Slice of Life"], ["Toradora", "Romance/Comedy"],
    ["Maid-sama", "Romance/Comedy"], ["Ouran High School", "Romance/Comedy"], ["Nana", "Drama/Romance"],
    ["Paradise Kiss", "Drama/Romance"], ["Beck", "Drama/Music"], ["Monster", "Thriller/Mystery"],
    ["Kingdom", "Action/Historical"], ["Golden Kamuy", "Action/Adventure"], ["Dorohedoro", "Action/Fantasy"],
    ["Beastars", "Drama/Psychological"], ["Odd Taxi", "Mystery/Drama"], ["Ranking of Kings", "Fantasy/Adventure"],
    ["Blue Period", "Drama/Slice of Life"], ["GTO", "Comedy/Drama"], ["Slam Dunk", "Sports/Drama"],
    ["YuYu Hakusho", "Action/Supernatural"], ["Rurouni Kenshin", "Action/Adventure"], ["Inuyasha", "Action/Fantasy"],
    ["Sailor Moon", "Fantasy/Romance"], ["Cardcaptor Sakura", "Fantasy/Adventure"], ["Digimon", "Adventure/Fantasy"],
    ["Pokemon", "Adventure/Fantasy"], ["Yu-Gi-Oh", "Action/Fantasy"], ["Beyblade", "Action/Sports"],
    ["Hellsing", "Action/Horror"], ["Black Lagoon", "Action/Crime"], ["Baccano!", "Action/Mystery"],
    ["Durarara!!", "Action/Mystery"], ["Trigun", "Sci-Fi/Action"], ["Claymore", "Action/Fantasy"],
    ["Elfen Lied", "Horror/Drama"]
  ];

  const insertAnime = db.prepare("INSERT INTO anime (id, title, description, poster, genre) VALUES (?, ?, ?, ?, ?)");
  popularAnime.forEach((a, i) => {
    const id = (i + 5).toString();
    insertAnime.run(id, a[0], `A highly acclaimed anime in the ${a[1]} genre.`, `https://picsum.photos/seed/anime${id}/400/600`, a[1]);
  });
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);
  const PORT = 3000;

  app.use(express.json());

  // Profile Update Route
  app.post("/api/user/update", (req, res) => {
    const { id, username, bio, avatar } = req.body;
    db.prepare("UPDATE users SET username = ?, bio = ?, avatar = ? WHERE id = ?").run(username, bio, avatar, id);
    res.json({ success: true });
  });

  // File Upload Setup
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
  app.use("/uploads", express.static(uploadDir));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  });
  const upload = multer({ storage });

  // API Routes
  app.get("/api/anime", (req, res) => {
    const anime = db.prepare("SELECT * FROM anime").all();
    res.json(anime);
  });

  app.get("/api/user/:id", (req, res) => {
    let user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id) as any;
    if (!user) {
      // Create default user if not exists
      db.prepare("INSERT INTO users (id, username, avatar) VALUES (?, ?, ?)").run(req.params.id, "Otaku_" + req.params.id.slice(0, 4), "https://picsum.photos/seed/" + req.params.id + "/200/200");
      user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
    }
    res.json(user);
  });

  app.post("/api/stats", upload.single("file"), (req: any, res) => {
    const { userId, caption, type } = req.body;
    const url = `/uploads/${req.file?.filename}`;
    db.prepare("INSERT INTO stats (userId, type, url, caption) VALUES (?, ?, ?, ?)").run(userId, type, url, caption);
    // Award XP for posting
    db.prepare("UPDATE users SET xp = xp + 10 WHERE id = ?").run(userId);
    res.json({ success: true, url });
  });

  app.get("/api/stats", (req, res) => {
    const stats = db.prepare(`
      SELECT stats.*, users.username, users.avatar 
      FROM stats 
      JOIN users ON stats.userId = users.id 
      ORDER BY timestamp DESC
    `).all();
    res.json(stats);
  });

  app.post("/api/vote", (req, res) => {
    const { userId, animeId, category } = req.body;
    db.prepare("INSERT INTO votes (userId, animeId, category) VALUES (?, ?, ?)").run(userId, animeId, category);
    db.prepare("UPDATE users SET xp = xp + 5 WHERE id = ?").run(userId);
    res.json({ success: true });
  });

  // Socket.io Chat
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (room) => {
      socket.join(room);
      // Send last 50 messages
      const messages = db.prepare("SELECT * FROM chat_messages WHERE room = ? ORDER BY timestamp DESC LIMIT 50").all(room);
      socket.emit("previous-messages", messages.reverse());
    });

    socket.on("send-message", (data) => {
      const { room, userId, username, message } = data;
      db.prepare("INSERT INTO chat_messages (room, userId, username, message) VALUES (?, ?, ?, ?)").run(room, userId, username, message);
      io.to(room).emit("new-message", { ...data, timestamp: new Date() });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
