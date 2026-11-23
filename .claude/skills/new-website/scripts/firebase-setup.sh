#!/usr/bin/env bash
# Creates the Firebase project, a web app, the Firestore database, and saves the web config.
# Usage: firebase-setup.sh <project-id> "<Display Name>" <web-config-out.json> [firestore-location]
# Idempotent: skips whatever already exists.
set -uo pipefail
PID="$1"; NAME="$2"; OUT="$3"; LOC="${4:-nam5}"

if firebase projects:list --json 2>/dev/null | grep -q "\"projectId\": \"$PID\""; then
  echo "project $PID already exists"
else
  echo "creating project $PID ..."
  if ! firebase projects:create "$PID" --display-name "$NAME"; then
    echo "FAILED: projects:create. Usual causes: id already taken (try another), or the Google"
    echo "account has not accepted Firebase terms (open https://console.firebase.google.com once)."
    exit 10
  fi
fi

APP_ID=$(firebase apps:list WEB --project "$PID" --json 2>/dev/null \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const a=JSON.parse(s).result;console.log(a[0]?.appId??"")}catch{console.log("")}})')
if [ -z "$APP_ID" ]; then
  echo "creating web app ..."
  firebase apps:create WEB "$NAME" --project "$PID" || exit 11
  APP_ID=$(firebase apps:list WEB --project "$PID" --json \
    | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).result[0].appId))')
fi
echo "web app: $APP_ID"

firebase apps:sdkconfig WEB "$APP_ID" --project "$PID" --json \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log(JSON.stringify(j.result?.sdkConfig??j.sdkConfig??j))})' > "$OUT" || exit 12
echo "web config saved to $OUT"

echo "creating Firestore database ($LOC) ..."
if ! firebase firestore:databases:create '(default)' --location "$LOC" --project "$PID"; then
  echo "NOTE: database create failed or already exists; check with: firebase firestore:databases:list --project $PID"
fi
