#!/bin/bash
echo "Preparing .well-known for Farcaster..."
mkdir -p .well-known
if [ -f Build/.well-known/farcaster.json ]; then
  cp Build/.well-known/farcaster.json .well-known/farcaster.json
  echo "Copied farcaster.json successfully."
else
  echo "ERROR: Build/.well-known/farcaster.json not found!"
  exit 1
fi
