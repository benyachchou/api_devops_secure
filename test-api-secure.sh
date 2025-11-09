#!/bin/bash

echo "=== Test de l'API REST Sécurisée ==="
echo ""

BASE_URL="http://localhost:3000"

echo "1. Test avec un utilisateur standard (Alice - user) :"
echo "   Se connecter avec Alice..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","motDePasse":"password123"}')

echo "$LOGIN_RESPONSE" | python3 -m json.tool
echo ""

# Extraire le token (méthode simple avec grep)
USER_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$USER_TOKEN" ]; then
    echo "❌ Erreur: Impossible d'obtenir le token"
    exit 1
fi

echo "   Token reçu: ${USER_TOKEN:0:50}..."
echo ""

echo "2. Voir le profil d'Alice (authentifié avec JWT) :"
curl -X GET $BASE_URL/auth/profile \
  -H "Authorization: Bearer $USER_TOKEN" | python3 -m json.tool
echo ""

echo "3. Lister les ressources avec Alice (authentifié) :"
curl -X GET $BASE_URL/resources \
  -H "Authorization: Bearer $USER_TOKEN" | python3 -m json.tool
echo ""

echo "4. Essayer de créer une ressource avec Alice (doit échouer - admin requis) :"
curl -X POST $BASE_URL/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{"name":"Ressource créée par user"}' | python3 -m json.tool
echo ""

echo "5. Test avec un administrateur (admin) :"
echo "   Se connecter avec Admin..."
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","motDePasse":"admin123"}')

echo "$ADMIN_LOGIN_RESPONSE" | python3 -m json.tool
echo ""

ADMIN_TOKEN=$(echo "$ADMIN_LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
    echo "❌ Erreur: Impossible d'obtenir le token admin"
    exit 1
fi

echo "   Token admin reçu: ${ADMIN_TOKEN:0:50}..."
echo ""

echo "6. Créer une ressource avec Admin (admin) :"
curl -X POST $BASE_URL/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name":"Ressource créée par admin"}' | python3 -m json.tool
echo ""

echo "7. Lister toutes les ressources avec Admin :"
curl -X GET $BASE_URL/resources \
  -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool
echo ""

echo "8. Supprimer une ressource avec Admin (admin) :"
curl -X DELETE $BASE_URL/resources/1 \
  -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool
echo ""

echo "=== Tests terminés ==="

