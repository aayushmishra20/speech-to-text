{
    "version": 2,
    "builds": [
      {
        "src": "api/send-email.js",
        "use": "@vercel/node"
      },
      {
        "src": "index.html",
        "use": "@vercel/static"
      },
      {
        "src": "volunteer.html",
        "use": "@vercel/static"
      },
      {
        "src": "programs.html",
        "use": "@vercel/static"
      }
    ]
  }
  