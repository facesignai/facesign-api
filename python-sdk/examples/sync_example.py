"""
Synchronous API usage example.
"""

import os
from facesign import FaceSignClient


def main():
    """Example using synchronous API calls."""
    
    # Initialize client
    api_key = os.getenv("FACESIGN_API_KEY", "sk_test_...")
    client = FaceSignClient(api_key=api_key)
    
    try:
        # Get available languages
        print("Getting supported languages...")
        languages = client.languages.get()
        print(f"✅ Found {len(languages.langs)} supported languages:")
        for lang in languages.langs[:5]:  # Show first 5
            print(f"  - {lang.id}: {lang.title}")
        
        # Get available avatars
        print(f"\nGetting available avatars...")
        avatars = client.avatars.get()
        print(f"✅ Found {len(avatars.avatars)} available avatars:")
        for avatar in avatars.avatars[:3]:  # Show first 3
            print(f"  - {avatar.id}: {avatar.name} ({avatar.gender})")
        
        # Create a simple session
        print(f"\nCreating a simple verification session...")
        session = client.sessions.create(
            client_reference_id="sync-example-789",
            metadata={
                "source": "python-sync-example",
                "api_type": "synchronous"
            },
            modules=[{"type": "identityVerification"}],
            avatar_id=avatars.avatars[0].id if avatars.avatars else None,
            default_lang="en"
        )
        
        print(f"✅ Session created!")
        print(f"Session ID: {session.session.id}")
        print(f"Using avatar: {avatars.avatars[0].name if avatars.avatars else 'default'}")
        
        # Refresh the client secret
        print(f"\nRefreshing client secret...")
        new_secret = client.sessions.refresh_client_secret(session.session.id)
        print(f"✅ New client secret generated!")
        print(f"New secret: {new_secret.secret}")
        print(f"Expires at: {new_secret.expire_at}")
        
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()