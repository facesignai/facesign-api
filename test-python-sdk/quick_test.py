#!/usr/bin/env python3
"""
Quick test to verify specific fixes.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from facesign import FaceSignClient

# Test configuration - using environment variables for security
API_KEY = os.getenv("FACESIGN_DEV_API_KEY", "your_dev_api_key_here")
SERVER_URL = os.getenv("FACESIGN_DEV_SERVER_URL", "https://api.dev.facesign.ai")

def test_avatars():
    print("Testing Avatars API...")
    client = FaceSignClient(API_KEY, server_url=SERVER_URL)
    
    try:
        avatars = client.avatars.get()
        print(f"✅ Avatars API working! Found {len(avatars.avatars)} avatars")
        first_avatar = avatars.avatars[0]
        print(f"✅ First avatar: {first_avatar.name} ({first_avatar.gender})")
        print(f"✅ Image URL: {first_avatar.image_url[:50]}...")
        return True
    except Exception as e:
        print(f"❌ Avatars API failed: {e}")
        return False

def test_session_creation():
    print("Testing Session Creation...")
    client = FaceSignClient(API_KEY, server_url=SERVER_URL)
    
    try:
        session = client.sessions.create(
            client_reference_id="quick-test-123",
            metadata={"test": "quick"},
            modules=[{"type": "identityVerification"}]
        )
        print(f"✅ Session creation working! ID: {session.session.id}")
        print(f"✅ Status: {session.session.status}")
        print(f"✅ Client secret: {session.client_secret.secret[:10]}...")
        return True
    except Exception as e:
        print(f"❌ Session creation failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Quick SDK Fix Tests")
    print("=" * 30)
    
    avatars_ok = test_avatars()
    print()
    session_ok = test_session_creation()
    
    print()
    print("📊 Results:")
    print(f"✅ Avatars API: {'PASS' if avatars_ok else 'FAIL'}")
    print(f"✅ Session API: {'PASS' if session_ok else 'FAIL'}")