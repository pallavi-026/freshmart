# 🚀 FreshMart Deployment Guide (Render + MongoDB Atlas)

Follow these steps to get your project live on the internet for free.

---

## 1. MongoDB Atlas Setup (The Database)
1.  Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  **Network Access:** Go to "Network Access" -> "Add IP Address" -> Click **"Allow Access From Anywhere"** (0.0.0.0/0).
3.  **Database User:** Create a user with a username and password (write these down!).
4.  **Connect:** Click "Connect" -> "Drivers" -> Copy the **Connection String**.
    *   Example: `mongodb+srv://user:pass@cluster0.mongodb.net/freshmart?retryWrites=true&w=majority`

---

## 2. Render Backend Setup (The Server)
1.  Log in to [Render.com](https://render.com/) with GitHub.
2.  Click **New +** -> **Web Service**.
3.  Connect your `freshmart` repository.
4.  **Name:** `freshmart-backend`
5.  **Root Directory:** `server`
6.  **Build Command:** `npm install`
7.  **Start Command:** `npm start`
8.  **Environment Variables (Click "Advanced"):**
    *   `MONGODB_URI`: [Your MongoDB Atlas String]
    *   `JWT_SECRET`: [Any random long string]
    *   `NODE_ENV`: `production`
    *   `CLIENT_URL`: [Leave blank for now, we will add it later]

---

## 3. Render Frontend Setup (The Website)
1.  On Render, click **New +** -> **Static Site**.
2.  Connect your `freshmart` repository again.
3.  **Name:** `freshmart-client`
4.  **Root Directory:** `client`
5.  **Build Command:** `npm run build`
6.  **Publish Directory:** `dist`
7.  **Environment Variables:**
    *   `VITE_API_URL`: [The URL of your Backend Service from Step 2] + `/api`
    *   *(Example: `https://freshmart-backend.onrender.com/api`)*

---

## 4. Final Connection
1.  Copy the URL of your **Frontend** (Static Site).
2.  Go back to your **Backend Service** -> Settings -> Environment.
3.  Update `CLIENT_URL` with your Frontend URL.
4.  **Save changes.**

---

### 🎉 Success!
Your website will now be live at your Frontend URL. Note that on the free tier, the first load might take 30-50 seconds as the server wakes up.
