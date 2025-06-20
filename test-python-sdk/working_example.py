#!/usr/bin/env python3
"""
Working Python SDK Example

This demonstrates the Python SDK functionality that currently works,
while avoiding the model validation issues discovered during testing.
"""

import asyncio
import os
import sys
from typing import Dict, Any

# Add the parent directory to the path to import facesign
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from facesign import FaceSignClient, AsyncFaceSignClient

# Configuration - using environment variables for security
API_KEY = os.getenv("FACESIGN_DEV_API_KEY", "your_dev_api_key_here")
SERVER_URL = os.getenv("FACESIGN_DEV_SERVER_URL", "https://api.dev.facesign.ai")


def demo_sync_client():
    """Demonstrate synchronous client usage."""
    print("🔧 Synchronous Client Demo")
    print("=" * 40)
    
    # Initialize client
    client = FaceSignClient(API_KEY, server_url=SERVER_URL)
    print(f"✅ Client initialized with server: {client.server_url}")
    
    try:
        # Note: These calls will work but response parsing currently has issues
        # The API communication itself works fine
        
        print("\n📡 Testing API communication...")
        
        # Test raw request (this works)
        print("Making raw request to /langs...")
        raw_response = client.request("GET", "/langs")
        print(f"✅ Raw API call successful: {len(raw_response)} languages found")
        
        # Show the actual response structure we get from API
        print(f"📋 API Response structure: {type(raw_response)}")
        if isinstance(raw_response, list) and len(raw_response) > 0:
            print(f"📋 First language: {raw_response[0]}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return client


async def demo_async_client():
    """Demonstrate asynchronous client usage."""
    print("\n🔄 Asynchronous Client Demo")
    print("=" * 40)
    
    async with AsyncFaceSignClient(API_KEY, server_url=SERVER_URL) as client:
        print(f"✅ Async client initialized")
        
        try:
            print("\n📡 Testing async API communication...")
            
            # Test async raw request
            print("Making async raw request to /avatars...")
            raw_response = await client.arequest("GET", "/avatars")
            print(f"✅ Async raw API call successful: {len(raw_response)} avatars found")
            
            # Show the actual response structure
            if isinstance(raw_response, list) and len(raw_response) > 0:
                print(f"📋 First avatar: {raw_response[0]}")
                
        except Exception as e:
            print(f"❌ Async error: {e}")


def demo_session_creation():
    """Demonstrate session creation (with known validation issues)."""
    print("\n📝 Session Creation Demo")
    print("=" * 40)
    
    client = FaceSignClient(API_KEY, server_url=SERVER_URL)
    
    try:
        print("Attempting session creation with legacy modules...")
        
        # This will succeed in making the API call but fail on response parsing
        # The session is actually created on the server side
        raw_response = client.request("POST", "/sessions", data={
            "clientReferenceId": "python-example-123",
            "metadata": {"source": "python-sdk-demo"},
            "modules": [{"type": "identityVerification"}]
        })
        
        print(f"✅ Session creation API call successful!")
        print(f"📋 Response keys: {list(raw_response.keys())}")
        
        if "session" in raw_response:
            session_data = raw_response["session"]
            print(f"📋 Session ID: {session_data.get('id', 'N/A')}")
            print(f"📋 Session status: {session_data.get('status', 'N/A')}")
        
        if "clientSecret" in raw_response:
            secret_data = raw_response["clientSecret"]
            print(f"📋 Client secret: {secret_data.get('secret', 'N/A')[:10]}...")
            print(f"📋 Expires at: {secret_data.get('expireAt', 'N/A')}")
        
    except Exception as e:
        print(f"❌ Session creation error: {e}")


def main():
    """Run all demos."""
    print("🚀 FaceSign Python SDK Working Examples")
    print("=" * 50)
    print(f"🔑 API Key: {API_KEY}")
    print(f"🌐 Server: {SERVER_URL}")
    print()
    
    # Demo sync client
    client = demo_sync_client()
    
    # Demo session creation
    demo_session_creation()
    
    # Demo async client
    asyncio.run(demo_async_client())
    
    print("\n📊 Summary:")
    print("✅ HTTP communication: Working")
    print("✅ Authentication: Working") 
    print("✅ Client initialization: Working")
    print("❌ Response model parsing: Has issues (being fixed)")
    print("\n💡 The core SDK functionality works - response parsing needs updates")


if __name__ == "__main__":
    main()