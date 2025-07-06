# 🚀 GUÍA: Crear Servidor Local para CPS Test Pro

## Opción 1: Servidor Node.js Simple

### Paso 1: Instalar Node.js
```bash
# Descargar desde: https://nodejs.org/
# Verificar instalación:
node --version
npm --version
```

### Paso 2: Crear servidor
```javascript
// server.js
const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rutas específicas para SEO
app.get('/cps-test', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/aim-trainer', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/reaction-test', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 CPS Test Pro ejecutándose en http://localhost:${PORT}`);
});
```

### Paso 3: Package.json
```json
{
  "name": "cps-test-pro-server",
  "version": "1.0.0",
  "description": "Servidor para CPS Test Pro",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Paso 4: Comandos
```bash
# Instalar dependencias
npm install

# Ejecutar servidor
npm start

# Desarrollo con auto-reload
npm run dev
```

## Opción 2: Exponer a Internet con ngrok

### Paso 1: Instalar ngrok
```bash
npm install -g ngrok
# O descargar desde: https://ngrok.com/
```

### Paso 2: Exponer servidor
```bash
# Ejecutar tu servidor local (puerto 3000)
npm start

# En otra terminal, exponer a internet
ngrok http 3000

# Te dará URLs como:
# https://abc123.ngrok.io -> tu servidor local
```

### Ventajas de ngrok:
```
✅ GRATIS para testing
✅ HTTPS automático
✅ URL pública inmediata
✅ Perfecto para demos

❌ URL cambia cada vez
❌ Límites en plan gratuito
❌ Requiere PC encendida 24/7
```

## Opción 3: Deploy en Railway (Gratis)

### Paso 1: Subir a GitHub
```bash
git init
git add .
git commit -m "CPS Test Pro server"
git push origin main
```

### Paso 2: Conectar Railway
```
1. Ir a: https://railway.app/
2. Login con GitHub
3. "New Project" -> "Deploy from GitHub"
4. Seleccionar tu repositorio
5. ¡Deploy automático!
```

## Opción 4: VPS Económico (DigitalOcean)

### Paso 1: Crear Droplet
```
1. Ir a: https://digitalocean.com/
2. Crear cuenta ($100 crédito gratis)
3. Crear Droplet Ubuntu 22.04
4. Elegir plan $4/mes (1GB RAM)
```

### Paso 2: Configurar servidor
```bash
# Conectar por SSH
ssh root@tu-ip-servidor

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Instalar PM2 (gestor de procesos)
npm install -g pm2

# Clonar tu proyecto
git clone https://github.com/tu-usuario/cps-test-pro.git
cd cps-test-pro

# Instalar dependencias
npm install

# Ejecutar con PM2
pm2 start server.js --name "cps-test-pro"
pm2 startup
pm2 save
```

### Paso 3: Configurar dominio
```bash
# Instalar Nginx
apt update
apt install nginx

# Configurar proxy reverso
nano /etc/nginx/sites-available/cps-test-pro

# Contenido del archivo:
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Activar sitio
ln -s /etc/nginx/sites-available/cps-test-pro /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## 🎯 RECOMENDACIÓN FINAL

### Para tu caso específico:
```
1. 🏆 MANTÉN NETLIFY para producción
2. 🔬 USA servidor local para experimentar
3. 💰 VPS solo si necesitas backend/base de datos
4. 🚀 ngrok para demos rápidos
```

### Costos estimados:
```
Netlify (actual): $0/mes ✅
Servidor local: $0/mes + electricidad
VPS básico: $4-6/mes
Hosting compartido: $2-4/mes
```

### ¿Cuándo cambiar de Netlify?
```
❌ Solo si necesitas:
- Base de datos real
- APIs del servidor
- Procesamiento backend
- Control total del servidor

✅ Para tu CPS Test Pro actual:
- Netlify es PERFECTO
- Gratis y profesional
- Sin mantenimiento
```

¿Te interesa probar alguna de estas opciones? ¿O prefieres optimizar tu setup actual en Netlify?
