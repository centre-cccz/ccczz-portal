# CCCZ Portal - Production Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Docker (optional, for containerized deployment)

### Environment Setup
1. Copy environment template:
   ```bash
   cp .env.production.example .env.production.local
   ```

2. Fill in your production values in `.env.production.local`

3. Install dependencies:
   ```bash
   npm install
   ```

## 📦 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npm run deploy:vercel
# or
./deploy-production.sh vercel
```

### Option 2: cPanel/Shared Hosting
```bash
# Build for production
./deploy-production.sh cpanel

# Upload the generated .tar.gz file to your cPanel
# Extract and run: npm install && npm run build
```

### Option 3: Docker
```bash
# Build and run with Docker
./deploy-production.sh docker

# Or manually:
docker build -f Dockerfile.prod -t cccz-portal .
docker run -p 3000:3000 cccz-portal
```

### Option 4: GitHub Pages (Static)
```bash
# Export static files
./deploy-production.sh github-pages

# Deploy 'out' directory to GitHub Pages
```

## 🔧 Configuration

### Environment Variables
See `.env.production.example` for all required variables.

### Database Setup
1. Create PostgreSQL/MySQL database
2. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
3. Seed initial data:
   ```bash
   npx prisma db seed
   ```

### Domain & SSL
- Configure your domain in Vercel/cPanel
- Enable HTTPS (automatic on Vercel)
- Update `NEXTAUTH_URL` in environment

## 📊 Monitoring & Analytics

### Google Analytics
Add your GA4 tracking ID to `GA_TRACKING_ID`

### Error Monitoring
Configure Sentry DSN in `SENTRY_DSN`

### Health Checks
- Health endpoint: `/api/health`
- Monitor response status and database connectivity

## 🔒 Security Checklist

- [ ] Environment variables configured
- [ ] Database credentials secured
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Security headers active
- [ ] API keys rotated
- [ ] Admin access restricted

## 🚦 Testing Production

### Automated Tests
```bash
npm test
```

### Manual Testing Checklist
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] Events display properly
- [ ] Responsive design
- [ ] SEO meta tags present
- [ ] Performance acceptable

## 🔄 Maintenance

### Updates
```bash
# Pull latest changes
git pull origin main

# Install updates
npm install

# Run migrations if needed
npx prisma migrate deploy

# Deploy
npm run deploy:vercel
```

### Backups
- Database: Configure automated backups
- Files: Backup uploaded content
- Code: Keep deployment scripts updated

## 🆘 Troubleshooting

### Common Issues

**Build fails:**
- Check Node.js version (18+)
- Clear cache: `rm -rf .next node_modules && npm install`

**Database connection:**
- Verify DATABASE_URL format
- Check firewall settings
- Ensure database server is running

**Environment variables:**
- Use `.env.production.local` for production
- Never commit `.env` files
- Restart application after changes

### Logs
Check application logs in your deployment platform's dashboard.

## 📞 Support

For deployment issues:
1. Check this guide
2. Review error logs
3. Test locally first
4. Contact development team

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Environment configured
- [ ] Database migrated
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] DNS propagated
- [ ] Site tested
- [ ] Monitoring active
- [ ] Backup configured
- [ ] Team notified

---

**Production URL:** https://cccz-portal.com
**Health Check:** https://cccz-portal.com/api/health
**Sitemap:** https://cccz-portal.com/sitemap.xml