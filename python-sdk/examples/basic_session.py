"""
Basic session creation example.
"""

import asyncio
import os
from facesign import FaceSignClient


async def main():
    """Create a basic verification session."""
    
    # Initialize client with API key
    api_key = os.getenv("FACESIGN_API_KEY", "sk_test_...")
    client = FaceSignClient(api_key=api_key)
    
    try:
        # Create a session with legacy modules
        print("Creating session with legacy modules...")
        session = await client.sessions.acreate(
            client_reference_id="python-example-user-123",
            metadata={
                "source": "python-sdk-example",
                "user_agent": "Python Example Script",
                "environment": "development"
            },
            modules=[
                {"type": "identityVerification"},
                {"type": "documentAuthentication"}
            ],
            initial_phrase="Welcome to FaceSign verification!",
            default_lang="en"
        )
        
        print(f"✅ Session created successfully!")
        print(f"Session ID: {session.session.id}")
        print(f"Status: {session.session.status}")
        print(f"Client Secret: {session.client_secret.secret}")
        print(f"Verification URL: {session.client_secret.url}")
        print(f"Expires at: {session.client_secret.expire_at}")
        
        # Retrieve the session to see current status
        print(f"\nRetrieving session {session.session.id}...")
        retrieved_session = await client.sessions.aretrieve(session.session.id)
        print(f"Current status: {retrieved_session.session.status}")
        
        # List recent sessions
        print(f"\nListing recent sessions...")
        sessions_list = await client.sessions.alist(limit=5, sort_order="desc")
        print(f"Found {len(sessions_list.sessions)} sessions:")
        for s in sessions_list.sessions:
            print(f"  - {s.id}: {s.status} (created: {s.created_at})")
        
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    asyncio.run(main())