#!/bin/bash

# Script para verificar configuración OAuth en producción

echo "=== VERIFICACIÓN DE CONFIGURACIÓN OAUTH ==="
echo ""

echo "🔍 Verificando variables de entorno:"
echo "VITE_AUTH0_DOMAIN: $VITE_AUTH0_DOMAIN"
echo "VITE_AUTH0_CLIENT_ID: $VITE_AUTH0_CLIENT_ID" 
echo "VITE_REDIRECT_URI: $VITE_REDIRECT_URI"
echo "VITE_API_URL: $VITE_API_URL"
echo ""

echo "📋 URLs que deben estar configuradas en Auth0:"
echo "Allowed Callback URLs:"
echo "  - http://localhost:5173"
echo "  - https://utepsa-gestura.netlify.app"
echo ""
echo "Allowed Web Origins:"
echo "  - http://localhost:5173"
echo "  - https://utepsa-gestura.netlify.app"
echo ""
echo "Allowed Logout URLs:"
echo "  - http://localhost:5173" 
echo "  - https://utepsa-gestura.netlify.app"
echo ""

echo "🔗 Enlaces para verificar en Auth0:"
echo "Application Settings: https://manage.auth0.com/dashboard/us/utepsa/applications/CkPtlmJZQmNsQQ68d8TdJmKKV01xroOx/settings"
echo "Social Connections: https://manage.auth0.com/dashboard/us/utepsa/connections/social"
echo "Logs: https://manage.auth0.com/dashboard/us/utepsa/logs"
echo ""

echo "⚠️  Error actual: 403 invalid_request"
echo "💡 Solución: Verificar que las URLs de callback estén exactamente configuradas en Auth0"
echo ""

# Test de conectividad
echo "🧪 Testeando conectividad al backend:"
if curl -s --head https://gestura-back-production.up.railway.app/health > /dev/null; then
    echo "✅ Backend accesible"
else
    echo "❌ Backend no accesible"
fi

echo ""
echo "=== FIN DE VERIFICACIÓN ==="
