# JWT Secret Setup Guide 🔐

## 🔑 Your JWT Secret

I've generated a secure JWT secret for you. **Keep this secret safe and never share it publicly!**

### How to Set It in Railway:

1. Go to your **Railway Dashboard**
2. Click on your **Backend Service** (the one with your API)
3. Go to the **"Variables"** tab
4. Click **"New Variable"**
5. Enter:
   - **Key**: `JWT_SECRET`
   - **Value**: [Paste the generated secret from the output above]
6. Click **"Add"**

Railway will automatically redeploy your service with the new secret!

---

## ✅ Security Notes

- ✅ **128 characters long** - Very secure
- ✅ **Randomly generated** - Cryptographically secure
- ✅ **Unique to your app** - Generated just for you
- ✅ **Never expires** - But you can rotate it anytime

---

## 🔄 How to Generate a New One

If you need to generate a new JWT secret:

```bash
node JWT-SECRET-GENERATOR.js
```

Or use this Node.js command:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ⚠️ Important

1. **Never commit** the JWT secret to GitHub
2. **Store it securely** in Railway environment variables
3. **Keep it private** - don't share it publicly
4. **Use the same secret** for all environments (or different ones per environment)

---

## 🚀 After Setting the Secret

Once you set `JWT_SECRET` in Railway:

1. Railway will automatically redeploy
2. Your server will start successfully
3. Authentication will work properly
4. Users can register and login

---

## 📋 Quick Checklist

- [ ] Copy the generated JWT secret
- [ ] Go to Railway → Your Backend Service
- [ ] Variables tab → New Variable
- [ ] Key: `JWT_SECRET`
- [ ] Value: [paste your secret]
- [ ] Click "Add"
- [ ] Wait for Railway to redeploy
- [ ] Test your API endpoints

---

**Your JWT secret is ready to use!** 🔐

