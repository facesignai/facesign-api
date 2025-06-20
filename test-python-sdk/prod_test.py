#!/usr/bin/env python3
"""
Test Python SDK against production API.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from facesign import FaceSignClient

# Production API configuration - using environment variables for security
PROD_API_KEY = os.getenv("FACESIGN_PROD_API_KEY", "your_prod_api_key_here")
PROD_SERVER_URL = os.getenv("FACESIGN_PROD_SERVER_URL", "https://api.facesign.ai")

def test_production_api():
    print("🌐 Testing Production API")
    print("=" * 30)
    client = FaceSignClient(PROD_API_KEY, server_url=PROD_SERVER_URL)
    
    results = {"passed": 0, "failed": 0}
    
    # Test Languages
    try:
        languages = client.languages.get()
        print(f"✅ Languages: {len(languages.langs)} languages")
        results["passed"] += 1
    except Exception as e:
        print(f"❌ Languages failed: {e}")
        results["failed"] += 1
    
    # Test Avatars
    try:
        avatars = client.avatars.get()
        print(f"✅ Avatars: {len(avatars.avatars)} avatars")
        results["passed"] += 1
    except Exception as e:
        print(f"❌ Avatars failed: {e}")
        results["failed"] += 1
    
    # Test Session Creation
    try:
        session = client.sessions.create(
            client_reference_id="prod-test-123",
            metadata={"test": "production"},
            modules=[{"type": "identityVerification"}]
        )
        print(f"✅ Session: {session.session.id} ({session.session.status})")
        results["passed"] += 1
    except Exception as e:
        print(f"❌ Session creation failed: {e}")
        results["failed"] += 1
    
    print()
    print("📊 Production API Results:")
    print(f"✅ Passed: {results['passed']}")
    print(f"❌ Failed: {results['failed']}")
    
    return results["failed"] == 0

if __name__ == "__main__":
    success = test_production_api()
    exit(0 if success else 1)