# 🚀 Quick Start Guide - ClinicHub Backend (SQLite)

Get your backend running in **3 simple steps**!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create `.env` File

Create a file named `.env` in the root folder with this content:

```env
PORT=3000
DB_PATH=data/clinichub.db
JWT_SECRET=your-secret-key-12345
```

**That's it!** No MongoDB setup needed - SQLite is file-based! 🎉

## Step 3: Start the Server

```bash
npm run dev
```

The database will be created automatically in `data/clinichub.db`!

That's it! 🎉

Your backend is now running at: **http://localhost:3000**

---

## 📝 What's Next?

1. **Test the API:** Visit http://localhost:3000/api/health
2. **Seed Clinics (Optional):** Run `node scripts/seed-clinics.js` to add sample clinics
3. **Test Registration:** Go to http://localhost:3000/register.html

## 🎯 SQLite Advantages

✅ **No server setup** - Just works!  
✅ **Easy backup** - Just copy the `.db` file  
✅ **Fast** - Perfect for your app  
✅ **Zero config** - Database created automatically  

## ❓ Need Help?

- **Database not created?** Check that `data/` folder has write permissions
- **Port already in use?** Change `PORT=3000` to another port in `.env`
- **More details?** Check `SQLITE-SETUP.md` for complete instructions

---

**Happy Coding!** 💻
