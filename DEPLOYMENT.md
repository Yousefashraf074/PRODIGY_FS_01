# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Server with sufficient resources (2GB RAM minimum)
- Environment variables configured
- SSL certificate (for production HTTPS)

## Local Development Deployment

### 1. Clone or Download Project
```powershell
cd PRODIGY_FS_01
```

### 2. Create Environment Files

#### Backend .env
```
PORT=5000
MONGODB_URI=mongodb://admin:password123@mongo:27017/auth_db?authSource=admin
JWT_SECRET=change_this_to_very_long_random_string_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

#### Frontend .env
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Build and Deploy
```powershell
# Build images
docker-compose build

# Start services
docker-compose up -d

# Verify all services are running
docker-compose ps
```

## Production Deployment

### 1. Prepare Production Environment Files

#### Backend .env.production
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth_db
JWT_SECRET=use_very_long_cryptographically_secure_random_string
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
```

#### Frontend .env.production
```
REACT_APP_API_URL=https://api.yourdomain.com
```

### 2. Security Configuration

#### Backend Security Enhancements
Create `backend/config/security.js`:
```javascript
const helmet = require('helmet');
const mongoSanitize = require('mongo-sanitize');
const rateLimit = require('express-rate-limit');

const securityConfig = {
  helmet: helmet(),
  mongoSanitize: mongoSanitize(),
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  })
};

module.exports = securityConfig;
```

### 3. Update docker-compose.yml for Production

```yaml
version: '3.8'

services:
  mongo:
    image: mongo:6.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    networks:
      - auth_network
    restart: unless-stopped

  backend:
    build:
      context: ./backend
    environment:
      PORT: 5000
      MONGODB_URI: ${MONGODB_URI}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRE: 7d
      NODE_ENV: production
      CLIENT_URL: ${CLIENT_URL}
    ports:
      - "5000:5000"
    depends_on:
      - mongo
    networks:
      - auth_network
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
    environment:
      REACT_APP_API_URL: ${API_URL}
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - auth_network
    restart: unless-stopped

volumes:
  mongodb_data:

networks:
  auth_network:
```

### 4. Deploy to Cloud Platforms

#### AWS EC2
```bash
# 1. SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Clone repository
git clone your-repo-url
cd PRODIGY_FS_01

# 5. Create .env file with production values
nano .env

# 6. Start services
sudo docker-compose up -d

# 7. Setup Nginx reverse proxy (optional)
sudo apt-get install nginx
```

#### DigitalOcean App Platform
```bash
# 1. Create app.yaml
cat > app.yaml << EOF
name: auth-system
services:
- name: backend
  github:
    repo: your-repo
    branch: main
  build_command: npm install
  run_command: npm start
  envs:
  - key: MONGODB_URI
    scope: RUN_AND_BUILD_TIME
    value: ${MONGODB_URI}
  - key: JWT_SECRET
    scope: RUN_AND_BUILD_TIME
    value: ${JWT_SECRET}

- name: frontend
  github:
    repo: your-repo
    branch: main
  build_command: npm install && npm run build
  run_command: npm start
  envs:
  - key: REACT_APP_API_URL
    scope: BUILD_TIME
    value: https://api.yourdomain.com

databases:
- name: mongodb
  engine: MONGODB
  version: "6"
EOF

# 2. Deploy
doctl apps create --spec app.yaml
```

#### Docker Hub Registry
```bash
# 1. Tag images
docker tag auth_backend your_username/auth_backend:latest
docker tag auth_frontend your_username/auth_frontend:latest

# 2. Push to Docker Hub
docker push your_username/auth_backend:latest
docker push your_username/auth_frontend:latest

# 3. Pull on production server
docker pull your_username/auth_backend:latest
docker pull your_username/auth_frontend:latest
```

### 5. Setup Reverse Proxy (Nginx)

Create `/etc/nginx/sites-available/auth-system`:
```nginx
upstream backend {
  server backend:5000;
}

upstream frontend {
  server frontend:3000;
}

server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;

  # Redirect to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name yourdomain.com www.yourdomain.com;

  # SSL configuration
  ssl_certificate /path/to/certificate.crt;
  ssl_certificate_key /path/to/private.key;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;

  # Frontend
  location / {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # API
  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### 6. Setup SSL Certificate

#### Using Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renewal setup
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 7. Health Checks & Monitoring

```bash
# Health check script
curl http://localhost:5000/api/health
curl http://localhost:3000
```

### 8. Database Backups

```bash
# Backup MongoDB
docker-compose exec mongo mongodump --out /backup

# Restore MongoDB
docker-compose exec mongo mongorestore /backup
```

### 9. Logging & Monitoring

#### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

#### Setup Log Aggregation (ELK Stack)
Add to docker-compose.yml:
```yaml
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
  environment:
    - discovery.type=single-node
  ports:
    - "9200:9200"

logstash:
  image: docker.elastic.co/logstash/logstash:8.0.0
  ports:
    - "5000:5000"

kibana:
  image: docker.elastic.co/kibana/kibana:8.0.0
  ports:
    - "5601:5601"
```

## Maintenance

### Update Services
```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build
```

### Scaling
```bash
# Scale backend service
docker-compose up -d --scale backend=3

# Use load balancer in front
```

### Performance Tuning

#### MongoDB
```bash
# Create indexes
docker-compose exec mongo mongosh
db.users.createIndex({email: 1})
```

#### Node.js
Update `backend/server.js`:
```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Start server
}
```

## Troubleshooting Production Issues

### Out of Memory
```bash
# Check memory usage
docker stats

# Increase container memory in docker-compose.yml
services:
  backend:
    mem_limit: 1g
```

### Database Connection Issues
```bash
# Test connection
docker-compose exec backend node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected'))"
```

### High CPU Usage
```bash
# Profile Node.js
docker-compose exec backend node --prof server.js
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall rules
- [ ] Enable MongoDB authentication
- [ ] Rotate JWT secret regularly
- [ ] Setup rate limiting
- [ ] Enable CORS properly
- [ ] Setup security headers
- [ ] Regular backups enabled
- [ ] Monitor logs
- [ ] Update dependencies regularly
- [ ] Setup intrusion detection

---

**Deployment Complete!**
